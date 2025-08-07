import { Course, CourseLevel, useAuthStore } from '@/store';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, ENROLL_IN_COURSE, UNENROLL_FROM_COURSE } from '@/lib/graphql';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface CourseCardProps {
    course: Course;
    showEnrollButton?: boolean;
    showEditButton?: boolean;
}

export default function CourseCard({ course, showEnrollButton = true, showEditButton = false }: CourseCardProps) {
    const { user, isAuthenticated } = useAuthStore();
    const { refetch: refetchMe } = useQuery(GET_ME);

    const [enrollInCourse, { loading: enrollLoading }] = useMutation(ENROLL_IN_COURSE);
    const [unenrollFromCourse, { loading: unenrollLoading }] = useMutation(UNENROLL_FROM_COURSE);

    const isEnrolled = course.enrollments?.some(enrollment => enrollment.user.id === user?.id);
    const userEnrollment = course.enrollments?.find(enrollment => enrollment.user.id === user?.id);
    const isProfessor = userEnrollment?.role === 'PROFESSOR';

    const getLevelColor = (level: CourseLevel) => {
        switch (level) {
            case CourseLevel.BEGINNER:
                return 'bg-green-100 text-green-800';
            case CourseLevel.INTERMEDIATE:
                return 'bg-yellow-100 text-yellow-800';
            case CourseLevel.ADVANCED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to enroll in courses');
            return;
        }

        try {
            await enrollInCourse({
                variables: { courseId: course.id },
            });
            toast.success('Successfully enrolled in course!');
            refetchMe();
        } catch (error: any) {
            toast.error(error.message || 'Failed to enroll in course');
        }
    };

    const handleUnenroll = async () => {
        try {
            await unenrollFromCourse({
                variables: { courseId: course.id },
            });
            toast.success('Successfully unenrolled from course!');
            refetchMe();
        } catch (error: any) {
            toast.error(error.message || 'Failed to unenroll from course');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {course.enrollments?.length || 0} enrolled
                </div>

                <div className="flex space-x-2">
                    <Link
                        href={`/courses/${course.id}`}
                        className="px-4 py-2 text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors text-sm font-medium"
                    >
                        View Details
                    </Link>

                    {showEditButton && isProfessor && (
                        <Link
                            href={`/courses/${course.id}/edit`}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                            Edit Course
                        </Link>
                    )}

                    {showEnrollButton && isAuthenticated && !isEnrolled && (
                        <button
                            onClick={handleEnroll}
                            disabled={enrollLoading}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                            {enrollLoading ? 'Enrolling...' : 'Enroll'}
                        </button>
                    )}

                    {isEnrolled && !isProfessor && (
                        <button
                            onClick={handleUnenroll}
                            disabled={unenrollLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                            {unenrollLoading ? 'Unenrolling...' : 'Unenroll'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
