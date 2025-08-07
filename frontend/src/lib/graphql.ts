import { gql } from '@apollo/client';

// Course Queries
export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      level
      createdAt
      updatedAt
      enrollments {
        id
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      title
      description
      level
      createdAt
      updatedAt
      enrollments {
        id
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;

// User Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      enrollments {
        id
        role
        course {
          id
          title
          description
          level
        }
      }
    }
  }
`;

export const GET_USER_ENROLLMENTS = gql`
  query GetUserEnrollments($userId: ID!) {
    userEnrollments(userId: $userId) {
      id
      role
      course {
        id
        title
        description
        level
      }
    }
  }
`;

// Authentication Mutations
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

// Course Mutations
export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      level
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      description
      level
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

// Enrollment Mutations
export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($courseId: ID!, $role: Role = STUDENT) {
    enrollInCourse(courseId: $courseId, role: $role) {
      id
      role
      user {
        id
        name
        email
      }
      course {
        id
        title
        description
        level
      }
    }
  }
`;

export const UNENROLL_FROM_COURSE = gql`
  mutation UnenrollFromCourse($courseId: ID!) {
    unenrollFromCourse(courseId: $courseId)
  }
`;
