import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const student = await prisma.user.create({
        data: {
            name: 'John Student',
            email: 'john@student.com',
            password: hashedPassword,
        },
    });

    const professor = await prisma.user.create({
        data: {
            name: 'Dr. Jane Professor',
            email: 'jane@professor.com',
            password: hashedPassword,
        },
    });

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@edutech.com',
            password: hashedPassword,
        },
    });

    // Create courses
    const reactCourse = await prisma.course.create({
        data: {
            title: 'React Fundamentals',
            description: 'Learn the basics of React including components, state management, and hooks. Perfect for beginners who want to start building modern web applications.',
            level: 'BEGINNER',
        },
    });

    const nodeCourse = await prisma.course.create({
        data: {
            title: 'Node.js Backend Development',
            description: 'Master backend development with Node.js, Express, and databases. Build robust APIs and server-side applications.',
            level: 'INTERMEDIATE',
        },
    });

    const fullStackCourse = await prisma.course.create({
        data: {
            title: 'Full Stack Web Development',
            description: 'Complete full-stack development course covering React, Node.js, databases, and deployment. Advanced project-based learning.',
            level: 'ADVANCED',
        },
    });

    const pythonCourse = await prisma.course.create({
        data: {
            title: 'Python for Data Science',
            description: 'Learn Python programming with focus on data analysis, machine learning, and visualization using pandas, numpy, and matplotlib.',
            level: 'INTERMEDIATE',
        },
    });

    // Create enrollments
    await prisma.enrollment.create({
        data: {
            userId: student.id,
            courseId: reactCourse.id,
            role: 'STUDENT',
        },
    });

    await prisma.enrollment.create({
        data: {
            userId: professor.id,
            courseId: reactCourse.id,
            role: 'PROFESSOR',
        },
    });

    await prisma.enrollment.create({
        data: {
            userId: professor.id,
            courseId: nodeCourse.id,
            role: 'PROFESSOR',
        },
    });

    await prisma.enrollment.create({
        data: {
            userId: student.id,
            courseId: pythonCourse.id,
            role: 'STUDENT',
        },
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
