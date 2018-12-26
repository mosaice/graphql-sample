import 'reflect-metadata';
import queryComplexity, {
  simpleEstimator,
  fieldConfigEstimator
} from 'graphql-query-complexity';
import { GraphQLServer } from 'graphql-yoga';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';
import { ResolveTime, ErrorInterceptor, DataInterceptor } from './middleware';
import { authChecker } from './utils/auth-checker';

// register 3rd party IOC container
TypeGraphQL.useContainer(Container);
TypeORM.useContainer(Container);

async function bootstrap() {
  try {
    // create TypeORM connection
    await TypeORM.createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'mosaice',
      password: '',
      database: 'employees',
      cache: true,
      logging: true,
      acquireTimeout: 1000 * 20,
      charset: 'utf8mb4',
      entities: ['src/entity/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
      }
    });

    // build TypeGraphQL executable schema
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [`${__dirname}/**/*-resolver.ts`],
      emitSchemaFile: true,
      authChecker,
      globalMiddlewares: [ErrorInterceptor, DataInterceptor, ResolveTime]
    });

    // create mocked context

    // Create GraphQL server
    const server = new GraphQLServer({
      schema,
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
    server.start(
      {
        formatError: TypeGraphQL.formatArgumentValidationError,
        cacheControl: true,
        debug: true,
        formatResponse: res => {
          res.code = res.errors ? 500 : 200;
          return res;
        },
        validationRules: req => [
          queryComplexity({
            // The maximum allowed query complexity, queries above this threshold will be rejected
            maximumComplexity: 200,
            // The query variables. This is needed because the variables are not available
            // in the visitor of the graphql-js library
            variables: req.query.variables,
            // Optional callback function to retrieve the determined query complexity
            // Will be invoked weather the query is rejected or not
            // This can be used for logging or to implement rate limiting
            onComplete: (complexity: number) => {
              console.log('Query Complexity:', complexity);
            },
            estimators: [
              // Using fieldConfigEstimator is mandatory to make it work with type-graphql
              fieldConfigEstimator(),
              // This will assign each field a complexity of 1 if no other estimator
              // returned a value. We can define the default value for field not explicitly annotated
              simpleEstimator({
                defaultComplexity: 1
              })
            ]
          }) as any
        ]
      },
      () => console.log('Server is running on localhost:4000')
    );
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
