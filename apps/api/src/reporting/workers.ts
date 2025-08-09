import { events } from "encore.dev";

interface ExportJob {
  tenant: string;
  jobId: string;
}

export const exportRequested = events.topic<ExportJob>("report.export");

export const worker = exportRequested.subscribe(async ({ tenant, jobId }) => {
  console.log(`export job ${jobId} for ${tenant}`);
});
