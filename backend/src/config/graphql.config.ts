import { registerAs } from '@nestjs/config';

export default registerAs('graphql', () => ({
  playground: process.env.GRAPHQL_PLAYGROUND === 'true',
  debug: process.env.GRAPHQL_DEBUG === 'true',
  autoSchemaFile: process.env.GRAPHQL_SCHEMA_FILE || 'src/schema.gql',
  sortSchema: process.env.GRAPHQL_SORT_SCHEMA === 'true',
  introspection: process.env.GRAPHQL_INTROSPECTION === 'true',
}));
