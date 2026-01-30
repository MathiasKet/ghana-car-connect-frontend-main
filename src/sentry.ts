import * as Sentry from "@sentry/react";

// Initialize Sentry with minimal configuration to avoid compatibility issues
Sentry.init({
  dsn: "https://797c2e7ee03597beefd5c34e676b11c3@o4510779042103296.ingest.us.sentry.io/4510779067793408",
  
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  
  // Environment
  environment: import.meta.env.MODE || 'development',

  // Release version
  release: 'carconnect-ghana@1.0.0',

  // Debug mode for development
  debug: import.meta.env.MODE === 'development',
});

export default Sentry;
