import { ReactNode } from 'react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="text-xl font-bold text-primary-600 hover:text-primary-700"
                            >
                                EduTech Nexus
                            </Link>
                            {isAuthenticated && (
                                <div className="ml-10 flex space-x-8">
                                    <Link
                                        href="/"
                                        className={`text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ${router.pathname === '/' ? 'text-primary-600' : ''
                                            }`}
                                    >
                                        Courses
                                    </Link>
                                    <Link
                                        href="/my-courses"
                                        className={`text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ${router.pathname === '/my-courses' ? 'text-primary-600' : ''
                                            }`}
                                    >
                                        My Courses
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-gray-700">Welcome, {user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <Link
                                        href="/login"
                                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
