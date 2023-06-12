import "dotenv/config";

import { hashidFromId } from "#src/utils/hashid";

const hashid = hashidFromId(1);

console.log(hashid);
