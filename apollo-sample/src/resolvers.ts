import { EmployeeExtended } from './model';
import { resolver } from 'graphql-sequelize';

export default {
  Query: {
    employees: resolver(EmployeeExtended, {
      list: true
    }),
    employee: resolver(EmployeeExtended, {
      before: (findOptions, args) => {
        findOptions.where = {
          emp_no: args.emp_no
        };
        // findOptions.order = [['emp_no', 'ASC']];
        return findOptions;
      }
    })
  },
  Employee: {
    salaries: resolver(EmployeeExtended.Salaries),
    titles: resolver(EmployeeExtended.Titles)
  }
  // Mutation: {

  // }
};
