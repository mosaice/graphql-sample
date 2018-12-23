import { EmployeeExtended, sequelize } from './model';
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
  },
  Mutation: {
    async createEmployee(_, { input }) {
      const {
        dataValues: { max_no }
      }: any = await EmployeeExtended.findOne({
        attributes: [[sequelize.fn('MAX', sequelize.col('emp_no')), 'max_no']]
      });

      return EmployeeExtended.create(
        {
          ...input,
          emp_no: max_no + 1
        },
        {
          include: [EmployeeExtended.Titles as any, EmployeeExtended.Salaries]
        }
      );
    }
  }
};
