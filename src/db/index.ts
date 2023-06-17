import { FetchDriver } from "@andersgee/kysely-fetch-driver";
import {
  Kysely,
  MysqlAdapter,
  MysqlIntrospector,
  MysqlQueryCompiler,
  SelectQueryBuilder,
  type CompiledQuery,
  type Simplify,
} from "kysely";
import { deserialize, serialize } from "superjson";
//import { urlWithSearchparams } from "#src/utils/url";
import { urlWithSearchparams } from "#src/utils/url";
import type { DB } from "./types";

//const AUTH_SECRET = `Basic ${process.env.DATABASE_HTTP_AUTH_SECRET}`;

declare module "kysely" {
  interface SelectQueryBuilder<DB, TB extends keyof DB, O> {
    /**
     * Plays nice with the fetch cache that nextjs extends.
     *
     * - notes:
     *     - use `.get()` with SELECT queries (takes standard RequestInit options as arg)
     *     - use `.execute()` for everything else (also uses fetch but with method POST aka not intended to be cached, think mutations)
     *
     * keep in mind that GET request has `{cache: "force-cache"}` by default in nextjs
     *
     * # Example
     *
     * ```ts
     * const examples = await db.selectFrom("Example").selectAll().get({
     *   next: { revalidate: 10 },
     * });
     * ```
     */
    get(init?: RequestInit): Promise<Simplify<O>[]>;
    /** same as get() but return first element */
    getFirst(init?: RequestInit): Promise<Simplify<O> | undefined>;
    getFirstOrThrow(init?: RequestInit): Promise<Simplify<O>>;
  }
}

SelectQueryBuilder.prototype.get = async function <O>(init?: RequestInit): Promise<Simplify<O>[]> {
  const compiledQuery = this.compile();
  const res = await executeWithFetchGet(compiledQuery, init);

  if (res.ok) {
    try {
      const result = deserialize(await res.json()) as any;
      return result.rows;
    } catch (error) {
      throw new Error("failed to deserialize response.json(), webserver should return superjson.serialize(result)");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
};

SelectQueryBuilder.prototype.getFirst = async function <O>(init?: RequestInit): Promise<Simplify<O> | undefined> {
  const [result] = await this.get(init);
  return result as Simplify<O> | undefined;
};

SelectQueryBuilder.prototype.getFirstOrThrow = async function <O>(init?: RequestInit): Promise<Simplify<O>> {
  const [result] = await this.get(init);
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

async function executeWithFetchGet(compiledQuery: CompiledQuery, init?: RequestInit) {
  const queryString = JSON.stringify(
    serialize({
      sql: compiledQuery.sql,
      parameters: compiledQuery.parameters,
    })
  );
  const url = urlWithSearchparams(process.env.DATABASE_HTTP_URL, {
    q: queryString,
  });
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    ...init,
  });
}

export const db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () =>
      new FetchDriver({
        url: process.env.DATABASE_HTTP_URL,
        authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
      }),
  },
});
