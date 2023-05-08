import {
  Kysely,
  MysqlAdapter,
  MysqlIntrospector,
  MysqlQueryCompiler,
} from "kysely";
import { FetchDriver } from "@andersgee/kysely-fetch-driver";
import type { DB } from "./types";

export const db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () =>
      new FetchDriver({
        url: process.env.DATABASE_HTTP_URL,
        authorization: `Basic ${process.env.DATABASE_HTTP_AUTH_SECRET}`,
      }),
  },
});
