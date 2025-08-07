import { useQuery } from '@apollo/client';
import { GET_ME } from '@/lib/graphql';
import { useAuthStore } from '@/store';
import CourseCard from '@/components/CourseCard';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MyCourses() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const { data, loading, error, refetch } = useQuery(GET_ME);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            refetch();
        }
    }, [isAuthenticated, refetch]);

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
                <p className="text-gray-600 mb-6">{error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const enrollments = data?.me?.enrollments || [];
    const studentCourses = enrollments.filter((enrollment: any) => enrollment.role === 'STUDENT');
    const professorCourses = enrollments.filter((enrollment: any) => enrollment.role === 'PROFESSOR');

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                <p className="text-gray-600 mt-2">
                    Manage your enrolled courses and teaching assignments
                </p>
            </div>

            {enrollments.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses yet</h2>                    <p className="text-gray-600 mb-6">
                        You haven&apos;t enrolled in any courses yet. Explore our course catalog to get started!
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
                    >
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {professorCourses.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Teaching</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {professorCourses.map((enrollment: any) => (
                                    <CourseCard
                                        key={enrollment.id}
                                        course={enrollment.course}
                                        showEnrollButton={false}
                                        showEditButton={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {studentCourses.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enrolled Courses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {studentCourses.map((enrollment: any) => (
                                    <CourseCard
                                        key={enrollment.id}
                                        course={enrollment.course}
                                        showEnrollButton={false}
                                        showEditButton={false}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
