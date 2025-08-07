import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COURSE, GET_COURSES } from '@/lib/graphql';
import { CourseLevel } from '@/store';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function CreateCourse() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState<CourseLevel>(CourseLevel.BEGINNER);
    const router = useRouter();

    const [createCourse, { loading }] = useMutation(CREATE_COURSE, {
        refetchQueries: [{ query: GET_COURSES }],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const { data } = await createCourse({
                variables: {
                    input: {
                        title: title.trim(),
                        description: description.trim(),
                        level,
                    },
                },
            });

            if (data?.createCourse) {
                toast.success('Course created successfully!');
                router.push(`/courses/${data.createCourse.id}`);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create course');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Course</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter course title"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Describe what students will learn in this course..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Level
                        </label>
                        <select
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value as CourseLevel)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value={CourseLevel.BEGINNER}>Beginner</option>
                            <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                            <option value={CourseLevel.ADVANCED}>Advanced</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
