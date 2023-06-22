//import { deserialize, serialize } from "superjson";
import { parse, stringify } from "devalue";
import type { CompiledQuery, DatabaseConnection, Driver, QueryResult } from "kysely";

export interface FetchDriverConfig {
  /**
   * The url of the http api sitting in front of your database
   *
   * example: "http://localhost:4000"
   * */
  url: string;
  /**
   * Passed to fetch() Authorization header
   *
   * example: "Basic SOMESECRET"
   * */
  authorization: string;
}

/**
 * This driver uses post requests with `fetch()` to a webserver that responds with the query result instead of querying the database directly.
 *
 * requires `superjson` dependency.
 *
 * # Example
 * ```ts
 * const kysely = new Kysely<DB>({
 *   dialect: {
 *     createAdapter: () => new MysqlAdapter(),
 *     createIntrospector: (db) => new MysqlIntrospector(db),
 *     createQueryCompiler: () => new MysqlQueryCompiler(),
 *     createDriver: () =>
 *       new FetchDriver({
 *         url: "http://localhost:4000",
 *         authorization: "Basic SOMESECRET",
 *       }),
 *  },
 * });
 * ```
 *
 * # Webserver
 *
 * You need to have a webserver located at `url` that handles the post requests for this driver to work. The webserver should handle requests like this:
 *
 * ```ts
 * import {serialize, deserialize} from "superjson";
 *
 * async function handler(request) {
 *  const result = await kysely.executeQuery(deserialize(request.body))
 *  return serialize(result)
 * }
 * ```
 * */
export class FetchDriver implements Driver {
  config: FetchDriverConfig;

  constructor(config: FetchDriverConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    // Nothing to do here.
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    return new FetchConnection(this.config);
  }

  async beginTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async commitTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async rollbackTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async releaseConnection(): Promise<void> {
    // Nothing to do here.
  }

  async destroy(): Promise<void> {
    // Nothing to do here.
  }
}

class FetchConnection implements DatabaseConnection {
  config: FetchDriverConfig;

  constructor(config: FetchDriverConfig) {
    this.config = config;
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const res = await fetch(this.config.url, {
      method: "POST",
      cache: "no-store",
      headers: {
        //"Content-Type": "application/json",
        "Content-Type": "text/plain",
        Authorization: this.config.authorization,
      },
      body: stringify(compiledQuery),
    });

    if (res.ok) {
      try {
        return parse(await res.text());
      } catch (error) {
        throw new Error("failed to deserialize response.json(), webserver should return superjson.serialize(result)");
      }
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  }

  async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("FetchConnection does not support streaming");
  }
}
