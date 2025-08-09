import { api } from "encore.dev";
import { authenticate } from "../common/auth";
import { HTTPError } from "../common/http";

export const closePeriod = api({ path: "/api/accounting/close", method: "POST" }, async (req) => {
  const auth = await authenticate(req.headers.authorization?.split(" ")[1]);
  if (!auth) throw new HTTPError(401, "Unauthorized");
  // idempotent close operation stub
  return { closed: true };
});
