const { ApolloServer } = require('apollo-server');
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
