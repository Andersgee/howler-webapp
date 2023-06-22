import type { DataTransformer } from "@trpc/server";
import { parse, stringify } from "devalue";

//https://trpc.io/docs/server/data-transformers

interface InputDataTransformer extends DataTransformer {
  /**
   * This function runs **on the client** before sending the data to the server.
   */
  serialize(object: any): any;
  /**
   * This function runs **on the server** to transform the data before it is passed to the resolver
   */
  deserialize(object: any): any;
}
interface OutputDataTransformer extends DataTransformer {
  /**
   * This function runs **on the server** before sending the data to the client.
   */
  serialize(object: any): any;
  /**
   * This function runs **only on the client** to transform the data sent from the server.
   */
  deserialize(object: any): any;
}

interface CombinedDataTransformer {
  /**
   * Specify how the data sent from the client to the server should be transformed.
   */
  input: InputDataTransformer;
  /**
   * Specify how the data sent from the server to the client should be transformed.
   */
  output: OutputDataTransformer;
}

/** something that enables passing Date,Set,Map etc between client/server, superjson gave me issues  */
export const transformer: CombinedDataTransformer = {
  input: {
    serialize: (object) => stringify(object),
    deserialize: (object) => parse(object),
  },
  output: {
    serialize: (object) => stringify(object),
    deserialize: (object) => parse(object),
  },
};
