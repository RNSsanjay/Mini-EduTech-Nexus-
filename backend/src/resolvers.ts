import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface Context {
    prisma: PrismaClient;
    user?: any;
}

export const resolvers = {
    Query: {
        // Course queries
        courses: async () => {
            return await prisma.course.findMany({
                include: {
                    enrollments: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        },

        course: async (_: any, { id }: { id: string }) => {
            return await prisma.course.findUnique({
                where: { id },
                include: {
                    enrollments: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        },

        // User queries
        me: async (_: any, __: any, { user }: Context) => {
            if (!user) throw new Error('Not authenticated');

            return await prisma.user.findUnique({
                where: { id: user.id },
                include: {
                    enrollments: {
                        include: {
                            course: true,
                        },
                    },
                },
            });
        },

        users: async () => {
            return await prisma.user.findMany({
                include: {
                    enrollments: {
                        include: {
                            course: true,
                        },
                    },
                },
            });
        },

        // Enrollment queries
        userEnrollments: async (_: any, { userId }: { userId: string }) => {
            return await prisma.enrollment.findMany({
                where: { userId },
                include: {
                    user: true,
                    course: true,
                },
            });
        },

        courseEnrollments: async (_: any, { courseId }: { courseId: string }) => {
            return await prisma.enrollment.findMany({
                where: { courseId },
                include: {
                    user: true,
                    course: true,
                },
            });
        },
    },

    Mutation: {
        // Authentication
        login: async (_: any, { email, password }: { email: string; password: string }) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            return { token, user };
        },

        register: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            return { token, user };
        },

        // Course mutations
        createCourse: async (_: any, { input }: { input: any }, { user }: Context) => {
            if (!user) throw new Error('Not authenticated');

            const course = await prisma.course.create({
                data: input,
                include: {
                    enrollments: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            // Automatically enroll the creator as a professor
            await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                    role: 'PROFESSOR',
                },
            });

            return course;
        },

        updateCourse: async (_: any, { id, input }: { id: string; input: any }, { user }: Context) => {
            if (!user) throw new Error('Not authenticated');

            // Check if user is a professor of this course
            const enrollment = await prisma.enrollment.findFirst({
                where: {
                    userId: user.id,
                    courseId: id,
                    role: 'PROFESSOR',
                },
            });

            if (!enrollment) {
                throw new Error('Not authorized to edit this course');
            }

            return await prisma.course.update({
                where: { id },
                data: input,
                include: {
                    enrollments: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        },

        deleteCourse: async (_: any, { id }: { id: string }, { user }: Context) => {
            if (!user) throw new Error('Not authenticated');

            // Check if user is a professor of this course
            const enrollment = await prisma.enrollment.findFirst({
                where: {
                    userId: user.id,
                    courseId: id,
                    role: 'PROFESSOR',
                },
            });

            if (!enrollment) {
                throw new Error('Not authorized to delete this course');
            }

            await prisma.course.delete({ where: { id } });
            return true;
        },

        // Enrollment mutations
        enrollInCourse: async (_: any, { courseId, role }: { courseId: string; role: string }, { user }: Context) => {
            if (!user) throw new Error('Not authenticated');

            const existingEnrollment = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId,
                    },
                },
            });

            if (existingEnrollment) {
                throw new Error('Already enrolled in this course');
            }

            return await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId,
                    role: role || 'STUDENT',
                },
                include: {
                    user: true,
                    course: true,
                },
            });
        },

        unenrollFromCourse: async (_: any, { courseId }: { courseId: string }, { user }: Context) => {
            if (!user) throw new Error('Not authenticated');

            await prisma.enrollment.delete({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId,
                    },
                },
            });

            return true;
        },
    },

    // Field resolvers
    Course: {
        enrollments: async (parent: any) => {
            return await prisma.enrollment.findMany({
                where: { courseId: parent.id },
                include: {
                    user: true,
                    course: true,
                },
            });
        },
    },

    User: {
        enrollments: async (parent: any) => {
            return await prisma.enrollment.findMany({
                where: { userId: parent.id },
                include: {
                    user: true,
                    course: true,
                },
            });
        },
    },

    Enrollment: {
        user: async (parent: any) => {
            return await prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
        course: async (parent: any) => {
            return await prisma.course.findUnique({
                where: { id: parent.courseId },
            });
        },
    },
};
