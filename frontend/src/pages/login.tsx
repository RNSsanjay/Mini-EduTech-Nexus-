import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/lib/graphql';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { loading }] = useMutation(LOGIN);
    const { login: loginUser } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await login({
                variables: { email, password },
            });

            if (data?.login) {
                loginUser(data.login.token, data.login.user);
                toast.success('Logged in successfully!');
                router.push('/');
            }
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        }
    };

    const handleDemoLogin = async (userType: 'student' | 'professor') => {
        const demoCredentials = {
            student: { email: 'john@student.com', password: 'password123' },
            professor: { email: 'jane@professor.com', password: 'password123' },
        };

        const credentials = demoCredentials[userType];

        try {
            const { data } = await login({
                variables: credentials,
            });

            if (data?.login) {
                loginUser(data.login.token, data.login.user);
                toast.success(`Logged in as demo ${userType}!`);
                router.push('/');
            }
        } catch (error: any) {
            toast.error(error.message || 'Demo login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
                    Sign In to EduTech Nexus
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleDemoLogin('student')}
                            disabled={loading}
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Demo Student
                        </button>
                        <button
                            onClick={() => handleDemoLogin('professor')}
                            disabled={loading}
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Demo Professor
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
