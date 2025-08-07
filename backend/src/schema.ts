import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum CourseLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum Role {
    STUDENT
    PROFESSOR
  }

  type User {
    id: ID!
    name: String!
    email: String!
    enrollments: [Enrollment!]!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    level: CourseLevel!
    enrollments: [Enrollment!]!
    createdAt: String!
    updatedAt: String!
  }

  type Enrollment {
    id: ID!
    user: User!
    course: Course!
    role: Role!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CourseInput {
    title: String!
    description: String!
    level: CourseLevel!
  }

  input UpdateCourseInput {
    title: String
    description: String
    level: CourseLevel
  }

  type Query {
    # Course queries
    courses: [Course!]!
    course(id: ID!): Course
    
    # User queries
    me: User
    users: [User!]!
    
    # Enrollment queries
    userEnrollments(userId: ID!): [Enrollment!]!
    courseEnrollments(courseId: ID!): [Enrollment!]!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!
    register(name: String!, email: String!, password: String!): AuthPayload!
    
    # Course mutations
    createCourse(input: CourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
    
    # Enrollment mutations
    enrollInCourse(courseId: ID!, role: Role = STUDENT): Enrollment!
    unenrollFromCourse(courseId: ID!): Boolean!
  }
`;
