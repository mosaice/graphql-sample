import express from 'express';
import graphqlHTTP from 'express-graphql';
import {
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLEnumType,
  GraphQLID,
  GraphQLScalarType
} from 'graphql';
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'mosaice',
    database: 'employees'
  });

  // const root = {
  //   employees: async config => {
  //     const [data] = await connection.query(
  //       'select * from `employees` limit ? offset ?',
  //       [config.limit, (config.page - 1) * config.limit]
  //     );
  //     return data;
  //   },

  // };

  const DateType = new GraphQLScalarType({
    name: 'Date',
    serialize(time) {
      return new Date(time).toLocaleString();
    }
  });

  const GenderType = new GraphQLEnumType({
    name: 'Gender',
    values: {
      Male: { value: 'M' },
      female: { value: 'F' }
    }
  });

  const SalaryType = new GraphQLObjectType({
    name: 'Salary',
    fields: {
      emp_no: {
        type: new GraphQLNonNull(GraphQLID)
      },
      salary: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      from_date: {
        type: new GraphQLNonNull(DateType)
      },
      to_date: {
        type: new GraphQLNonNull(DateType)
      }
    }
  });

  const TitleType = new GraphQLObjectType({
    name: 'Title',
    fields: {
      emp_no: {
        type: new GraphQLNonNull(GraphQLID)
      },
      title: {
        type: new GraphQLNonNull(GraphQLString)
      },
      from_date: {
        type: new GraphQLNonNull(DateType)
      },
      to_date: {
        type: new GraphQLNonNull(DateType)
      }
    }
  });

  const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: {
      emp_no: {
        type: new GraphQLNonNull(GraphQLID)
      },
      birth_date: {
        type: GraphQLString
      },
      first_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      last_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      gender: {
        type: new GraphQLNonNull(GenderType)
      },
      hire_date: {
        type: new GraphQLNonNull(DateType)
      },
      salaries: {
        type: new GraphQLList(SalaryType),
        async resolve(employee) {
          const [data] = await connection.query(
            'select * from `salaries` where `emp_no` = ?',
            [employee.emp_no]
          );
          return data;
        }
      },
      titles: {
        type: new GraphQLList(TitleType),
        async resolve(employee) {
          const [data] = await connection.query(
            'select * from `titles` where `emp_no` = ?',
            [employee.emp_no]
          );
          return data;
        }
      }
    }
  });

  const RootType = new GraphQLObjectType({
    name: 'RootType',
    fields: {
      employees: {
        type: new GraphQLList(EmployeeType),
        args: {
          limit: {
            type: GraphQLInt,
            defaultValue: 10
          },
          page: {
            type: GraphQLInt,
            defaultValue: 1
          }
        },
        async resolve(_, { limit, page }) {
          const [data] = await connection.query(
            'select * from `employees` limit ? offset ?',
            [limit, (page - 1) * limit]
          );
          return data;
        }
      }
    }
  });

  const schema = new GraphQLSchema({
    query: RootType
  });

  const app = express();
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      graphiql: true
    })
  );
  app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
}

main();
