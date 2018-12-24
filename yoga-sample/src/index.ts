import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import * as TypeGraphQL from 'type-graphql';

import { EmployeeResolver } from './resolver/employee-resolver';

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
      // synchronize: true,
      username: 'mosaice',
      password: '',
      database: 'employees',
      logging: true,
      cache: true,
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
      resolvers: [EmployeeResolver],
      emitSchemaFile: true
    });

    // create mocked context

    // Create GraphQL server
    const server = new GraphQLServer({ schema });

    // Start the server
    server.start(() => console.log('Server is running on localhost:4000'));
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
