import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum CourseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

export enum Role {
    STUDENT = 'STUDENT',
    PROFESSOR = 'PROFESSOR',
}

export interface User {
    id: string;
    name: string;
    email: string;
    enrollments?: Enrollment[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    level: CourseLevel;
    enrollments?: Enrollment[];
    createdAt: string;
    updatedAt: string;
}

export interface Enrollment {
    id: string;
    user: User;
    course: Course;
    role: Role;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (token: string, user: User) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token);
                }
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                set({ user: null, token: null, isAuthenticated: false });
            },
            updateUser: (user: User) => set({ user }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

interface AppState {
    courses: Course[];
    selectedCourse: Course | null;
    loading: boolean;
    error: string | null;
    setCourses: (courses: Course[]) => void;
    setSelectedCourse: (course: Course | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addCourse: (course: Course) => void;
    updateCourse: (course: Course) => void;
    removeCourse: (courseId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    courses: [],
    selectedCourse: null,
    loading: false,
    error: null,
    setCourses: (courses) => set({ courses }),
    setSelectedCourse: (course) => set({ selectedCourse: course }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addCourse: (course) => set((state) => ({ courses: [course, ...state.courses] })),
    updateCourse: (course) =>
        set((state) => ({
            courses: state.courses.map((c) => (c.id === course.id ? course : c)),
            selectedCourse: state.selectedCourse?.id === course.id ? course : state.selectedCourse,
        })),
    removeCourse: (courseId) =>
        set((state) => ({
            courses: state.courses.filter((c) => c.id !== courseId),
            selectedCourse: state.selectedCourse?.id === courseId ? null : state.selectedCourse,
        })),
}));
