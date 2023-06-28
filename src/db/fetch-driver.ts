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
    //no need to send compiledQuery.query
    const body = {
      sql: compiledQuery.sql,
      parameters: compiledQuery.parameters,
    };
    const res = await fetch(this.config.url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "text/plain",
        Authorization: this.config.authorization,
      },
      body: stringify(body),
    });

    if (res.ok) {
      try {
        return parse(await res.text());
      } catch (error) {
        throw new Error("failed to parse response");
      }
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  }

  async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("FetchConnection does not support streaming");
  }
}
