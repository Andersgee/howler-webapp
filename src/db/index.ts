import {
  type CompiledQuery,
  type QueryResult,
  Kysely,
  MysqlAdapter,
  MysqlIntrospector,
  MysqlQueryCompiler,
  Compilable,
  InferResult,
  //type SimplifySingleResult
} from "kysely";
import type {
  Simplify,
  SimplifyResult,
  SimplifySingleResult,
} from "kysely/dist/cjs/util/type-utils";
import { FetchDriver } from "@andersgee/kysely-fetch-driver";
import type { DB } from "./types";
import { deserialize, serialize } from "superjson";
import { urlWithSearchparams } from "src/utils/url";
//import { type SimplifySingleResult } from "kysely/dist/cjs/util/type-utils";

import { SelectQueryBuilder } from "kysely";

declare module "kysely" {
  interface SelectQueryBuilder<DB, TB extends keyof DB, O> {
    /**
     * fetch with method GET, only for SELECT queries
     *
     * also takes the normal fetch options such as `{cache: "no-cache"}` or `{next: {revalidate: 10}}`
     * */
    get(init?: RequestInit): Promise<SimplifyResult<O>[]>;
    /** same as get() but return first element */
    getFirst(init?: RequestInit): Promise<SimplifySingleResult<O>>;
    getFirstOrThrow(init?: RequestInit): Promise<Simplify<O>>;
  }
}

SelectQueryBuilder.prototype.get = async function <O>(
  init?: RequestInit
): Promise<SimplifyResult<O>[]> {
  const compiledQuery = this.compile();
  const res = await executeWithFetchGet(compiledQuery, init);

  if (res.ok) {
    try {
      const result = deserialize(await res.json()) as any;
      return result.rows;
    } catch (error) {
      throw new Error(
        "failed to deserialize response.json(), webserver should return superjson.serialize(result)"
      );
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
};

SelectQueryBuilder.prototype.getFirst = async function <O>(
  init?: RequestInit
): Promise<SimplifySingleResult<O>> {
  const [result] = await this.get(init);
  return result as SimplifySingleResult<O>;
};

SelectQueryBuilder.prototype.getFirstOrThrow = async function <O>(
  init?: RequestInit
): Promise<Simplify<O>> {
  const [result] = await this.get(init);
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

const AUTH_SECRET = `Basic ${process.env.DATABASE_HTTP_AUTH_SECRET}`;

export const db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () =>
      new FetchDriver({
        url: process.env.DATABASE_HTTP_URL,
        authorization: AUTH_SECRET,
      }),
  },
});

async function executeWithFetchGet(
  compiledQuery: CompiledQuery,
  init?: RequestInit
) {
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
      Authorization: AUTH_SECRET,
    },
    ...init,
  });
}
