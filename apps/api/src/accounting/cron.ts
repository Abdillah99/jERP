import { cron } from "encore.dev";
import { closePeriod } from "./service";

cron.monthly("month-end-close", async () => {
  await closePeriod({ headers: {} } as any);
});
