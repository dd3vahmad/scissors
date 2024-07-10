// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://163fa4b596ca4481679a2066c17dfebc@o4507561668575232.ingest.us.sentry.io/4507561679912960",
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
