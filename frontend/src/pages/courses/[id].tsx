import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COURSE, GET_ME, ENROLL_IN_COURSE, UNENROLL_FROM_COURSE } from '@/lib/graphql';
import { useAuthStore, CourseLevel } from '@/store';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CourseDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAuthenticated } = useAuthStore();

    const { data, loading, error, refetch } = useQuery(GET_COURSE, {
        variables: { id },
        skip: !id,
    });

    const { refetch: refetchMe } = useQuery(GET_ME);
    const [enrollInCourse, { loading: enrollLoading }] = useMutation(ENROLL_IN_COURSE);
    const [unenrollFromCourse, { loading: unenrollLoading }] = useMutation(UNENROLL_FROM_COURSE);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !data?.course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>                <p className="text-gray-600 mb-6">
                    The course you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link
                    href="/"
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                    Back to Courses
                </Link>
            </div>
        );
    }

    const course = data.course;
    const isEnrolled = course.enrollments?.some((enrollment: any) => enrollment.user.id === user?.id);
    const userEnrollment = course.enrollments?.find((enrollment: any) => enrollment.user.id === user?.id);
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
            router.push('/login');
            return;
        }

        try {
            await enrollInCourse({
                variables: { courseId: course.id },
            });
            toast.success('Successfully enrolled in course!');
            refetch();
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
            refetch();
            refetchMe();
        } catch (error: any) {
            toast.error(error.message || 'Failed to unenroll from course');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                                {course.level}
                            </span>
                            <span className="text-gray-500">
                                {course.enrollments?.length || 0} enrolled
                            </span>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        {isProfessor && (
                            <Link
                                href={`/courses/${course.id}/edit`}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
                            >
                                Edit Course
                            </Link>
                        )}

                        {!isAuthenticated && (
                            <button
                                onClick={() => router.push('/login')}
                                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                            >
                                Login to Enroll
                            </button>
                        )}

                        {isAuthenticated && !isEnrolled && (
                            <button
                                onClick={handleEnroll}
                                disabled={enrollLoading}
                                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
                            >
                                {enrollLoading ? 'Enrolling...' : 'Enroll in Course'}
                            </button>
                        )}

                        {isEnrolled && !isProfessor && (
                            <button
                                onClick={handleUnenroll}
                                disabled={unenrollLoading}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                            >
                                {unenrollLoading ? 'Unenrolling...' : 'Unenroll'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="prose max-w-none mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Description</h2>
                    <p className="text-gray-700 leading-relaxed">{course.description}</p>
                </div>

                {isEnrolled && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">                        <h3 className="text-lg font-semibold text-green-900 mb-2">
                        You&apos;re enrolled as a {userEnrollment?.role.toLowerCase()}
                    </h3>
                        <p className="text-green-700">
                            {isProfessor
                                ? "As a professor, you can edit course content and manage enrollments."
                                : "You now have access to all course materials and can track your progress."
                            }
                        </p>
                    </div>
                )}

                {course.enrollments && course.enrollments.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Participants</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.enrollments.map((enrollment: any) => (
                                <div
                                    key={enrollment.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{enrollment.user.name}</p>
                                        <p className="text-sm text-gray-600">{enrollment.user.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.role === 'PROFESSOR'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {enrollment.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link
                        href="/"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        ← Back to All Courses
                    </Link>
                </div>
            </div>
        </div>
    );
}
