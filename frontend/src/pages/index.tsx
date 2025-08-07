import { useQuery } from '@apollo/client';
import { GET_COURSES } from '@/lib/graphql';
import CourseCard from '@/components/CourseCard';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
    const { data, loading, error, refetch } = useQuery(GET_COURSES);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            refetch();
        }
    }, [isAuthenticated, refetch]);

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

    const courses = data?.courses || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
                    <p className="text-gray-600 mt-2">
                        Discover and enroll in courses to enhance your skills
                    </p>
                </div>

                {isAuthenticated && (
                    <Link
                        href="/courses/create"
                        className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
                    >
                        Create Course
                    </Link>
                )}
            </div>

            {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">
                        Welcome to EduTech Nexus!
                    </h2>
                    <p className="text-blue-700 mb-4">
                        Join our learning platform to access courses, track your progress, and connect with instructors.
                    </p>
                    <div className="flex space-x-4">
                        <Link
                            href="/register"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-700 px-6 py-2 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            )}

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses available</h2>
                    <p className="text-gray-600 mb-6">
                        Be the first to create a course and share your knowledge!
                    </p>
                    {isAuthenticated && (
                        <Link
                            href="/courses/create"
                            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors inline-block"
                        >
                            Create Your First Course
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course: any) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            showEnrollButton={true}
                            showEditButton={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
