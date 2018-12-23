const { gql } = require('apollo-server');

export default gql`
  type Employee {
    emp_no: ID!
    birth_date: String!
    first_name: String!
    last_name: String!
    gender: Gender!
    hire_date: String!
    salaries: [Salary!]
    titles: [Title!]
  }

  enum Gender {
    M
    F
  }

  type Salary {
    emp_no: ID!
    salary: Int!
    from_date: String!
    to_date: String!
  }

  type Title {
    emp_no: ID!
    title: String!
    from_date: String!
    to_date: String!
  }

  input SalaryInput {
    salary: Int!
    from_date: String!
    to_date: String!
  }

  input TitleInput {
    title: String!
    from_date: String!
    to_date: String!
  }

  input EmployeeInput {
    birth_date: String!
    first_name: String!
    last_name: String!
    gender: Gender!
    hire_date: String!
    salaries: [SalaryInput!]!
    titles: [TitleInput!]!
  }

  type Query {
    employees(limit: Int = 10, page: Int = 1): [Employee]!
    employee(emp_no: ID!): Employee
  }

  type Mutation {
    createEmployee(input: EmployeeInput!): Employee
  }
`;
