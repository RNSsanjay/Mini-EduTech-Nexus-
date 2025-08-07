import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COURSE, UPDATE_COURSE, DELETE_COURSE, GET_COURSES } from '@/lib/graphql';
import { CourseLevel } from '@/store';
import toast from 'react-hot-toast';

export default function EditCourse() {
    const router = useRouter();
    const { id } = router.query;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState<CourseLevel>(CourseLevel.BEGINNER);

    const { data, loading: queryLoading } = useQuery(GET_COURSE, {
        variables: { id },
        skip: !id,
    });

    const [updateCourse, { loading: updateLoading }] = useMutation(UPDATE_COURSE);
    const [deleteCourse, { loading: deleteLoading }] = useMutation(DELETE_COURSE, {
        refetchQueries: [{ query: GET_COURSES }],
    });

    useEffect(() => {
        if (data?.course) {
            setTitle(data.course.title);
            setDescription(data.course.description);
            setLevel(data.course.level);
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            await updateCourse({
                variables: {
                    id,
                    input: {
                        title: title.trim(),
                        description: description.trim(),
                        level,
                    },
                },
            });

            toast.success('Course updated successfully!');
            router.push(`/courses/${id}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update course');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteCourse({
                variables: { id },
            });

            toast.success('Course deleted successfully!');
            router.push('/');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete course');
        }
    };

    if (queryLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!data?.course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
                <button
                    onClick={() => router.back()}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                    <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete Course'}
                    </button>
                </div>

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
                            disabled={updateLoading}
                            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {updateLoading ? 'Updating...' : 'Update Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
