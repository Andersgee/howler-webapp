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
  SimplifyResult,
  SimplifySingleResult,
} from "kysely/dist/cjs/util/type-utils";
import { FetchDriver } from "@andersgee/kysely-fetch-driver";
import type { DB } from "./types";
import { deserialize, serialize } from "superjson";
import { urlWithSearchparams } from "src/utils/url";
//import { type SimplifySingleResult } from "kysely/dist/cjs/util/type-utils";

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
/*
async function post<T>(query: Compilable<T>): Promise<SimplifyResult<T>[]> {
  const compiledQuery = query.compile();
  const res = await fetch(process.env.DATABASE_HTTP_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.DATABASE_HTTP_AUTH_SECRET}`,
    },
    body: JSON.stringify(
      serialize({
        sql: compiledQuery.sql,
        parameters: compiledQuery.parameters,
      })
    ),
  });

  if (res.ok) {
    try {
      const result = deserialize(await res.json()) as any;
      if (result.rows) {
        return result.rows;
      }
      return result;
    } catch (error) {
      throw new Error(
        "failed to deserialize response.json(), webserver should return superjson.serialize(result)"
      );
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}

async function postTakeFirst<T>(
  query: Compilable<T>
): Promise<SimplifySingleResult<T>> {
  const [result] = await post(query);
  return result;
}
*/

/**
 * Use this with SELECT querys only
 * */
async function get<T>(
  query: Compilable<T>,
  init?: RequestInit | undefined
): Promise<SimplifyResult<T>[]> {
  const compiledQuery = query.compile();
  const queryString = JSON.stringify(
    serialize({
      sql: compiledQuery.sql,
      parameters: compiledQuery.parameters,
    })
  );

  const url = urlWithSearchparams(process.env.DATABASE_HTTP_URL, {
    q: queryString,
  });
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${process.env.DATABASE_HTTP_AUTH_SECRET}`,
    },
    ...init,
  });

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
}

async function getTakeFirst<T>(
  query: Compilable<T>,
  init?: RequestInit | undefined
): Promise<SimplifySingleResult<T>> {
  const [result] = await get(query, init);
  return result;
}

export const api = {
  get,
  getTakeFirst,
};

/*
async function ldeladla() {
  const examples = await post(db.selectFrom("Example").selectAll());
  const singleExample = await postTakeFirst(
    db.selectFrom("Example").selectAll()
  );

  const examples2 = await get(db.selectFrom("Example").selectAll());
  const singleExample2 = await getTakeFirst(
    db.selectFrom("Example").selectAll()
  );

  return examples;
}
*/
//const hmmmmm = await post(db.selectFrom("Example").selectAll().compile())
/*
async function hmm(q:CompiledQuery<T> | URL, init?: RequestInit | undefined) {
  init?.next.
  return fetch(input, {
    next: {

    }
  });
}
*/
