import { postgraphile } from 'postgraphile';
import { Pool } from 'pg';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';

const server = postgraphile(new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
}), ['public'], {
  graphqlRoute: '/api/graphql',
  graphiqlRoute: '/api/playground',
  graphiql: true,
  enhanceGraphiql: true,
  simpleCollections: 'both',
  disableQueryLog: true,
  appendPlugins: [ConnectionFilterPlugin, PgSimplifyInflectorPlugin],
  graphileBuildOptions: {
    pgOmitListSuffix: true,
    pgShortPk: true,
    connectionFilterSetofFunctions: false,
    connectionFilterArrays: false,
    connectionFilterComputedColumns: false,
    connectionFilterRelations: true,
    connectionFilterAllowEmptyObjectInput: true,
  },
  disableDefaultMutations: true,
});

export default server;
