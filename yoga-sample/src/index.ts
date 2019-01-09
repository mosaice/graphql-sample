import 'reflect-metadata';
import queryComplexity, {
  simpleEstimator,
  fieldConfigEstimator
} from 'graphql-query-complexity';
// import { GraphQLServer } from 'graphql-yoga';
import { ApolloServer } from 'apollo-server';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import { ResolveTime, ErrorInterceptor, DataInterceptor } from './middleware';
import { authChecker } from './utils/auth-checker';


// graphql-yoga 有bug query 不能传递变量，转移到 apollo 后正常使用

// register 3rd party IOC container
TypeGraphQL.useContainer(Container);
TypeORM.useContainer(Container);

async function bootstrap() {
  try {
    // create TypeORM connection
    const isProd = process.env.NODE_ENV === 'production';
    const SOURCE_PATH = isProd ? 'dist' : 'src';
    const file = isProd ? 'js' : 'ts';
    await TypeORM.createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'mosaice',
      password: '',
      database: 'employees',
      cache: true,
      logging: !isProd,
      acquireTimeout: 1000 * 20,
      charset: 'utf8mb4',
      entities: [`${SOURCE_PATH}/entity/**/*.${file}`],
      migrations: [`${SOURCE_PATH}/migration/**/*.${file}`],
      subscribers: [`${SOURCE_PATH}/subscriber/**/*.${file}`],
      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
      }
    });

    // build TypeGraphQL executable schema
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [`${__dirname}/**/*-resolver.${file}`],
      emitSchemaFile: !isProd,
      authChecker,
      globalMiddlewares: [ErrorInterceptor, DataInterceptor, ResolveTime]
    });

    // create mocked context

    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      formatError: TypeGraphQL.formatArgumentValidationError,
      cacheControl: true,
      debug: !isProd,
      formatResponse: res => {
        res.code = res.errors ? 500 : 200;
        return res;
      },
      // validationRules: req => [
      //   queryComplexity({
      //     // The maximum allowed query complexity, queries above this threshold will be rejected
      //     maximumComplexity: 30,
      //     // The query variables. This is needed because the variables are not available
      //     // in the visitor of the graphql-js library
      //     variables: req.query.variables,
      //     // Optional callback function to retrieve the determined query complexity
      //     // Will be invoked weather the query is rejected or not
      //     // This can be used for logging or to implement rate limiting
      //     onComplete: (complexity: number) => {
      //       if (!isProd) {
      //         console.log('Query Complexity:', complexity);
      //       }
      //     },
      //     estimators: [
      //       // Using fieldConfigEstimator is mandatory to make it work with type-graphql
      //       fieldConfigEstimator(),
      //       // This will assign each field a complexity of 1 if no other estimator
      //       // returned a value. We can define the default value for field not explicitly annotated
      //       simpleEstimator({
      //         defaultComplexity: 1
      //       })
      //     ]
      //   })
      // ],
      context: () => {
        const ctx = {
          // create mocked user in context
          // in real app you would be mapping user from `req.user` or sth
          user: {
            id: 1,
            name: 'Sample user',
            roles: ['REGULAR']
          }
        };
        return ctx;
      }
    });

    // Start the server
    server.listen(4000, () =>
      console.log('Server is running on localhost:4000')
    );
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
