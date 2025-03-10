import { ApplicationInsights, DistributedTracingModes, type ITelemetryItem } from "@microsoft/applicationinsights-web";

// Replace with your Azure Monitor Instrumentation Key
const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_AZURE_MONITOR_CONNECTION_STRING,
    disableCorrelationHeaders : false, // Enable distributed tracing
    enableAutoRouteTracking: true,  // Tracks router page views
    enableCorsCorrelation: true,    // Enables cross-origin correlation
    disableFetchTracking: false,    // Ensures fetch() calls are traced automatically
    disableAjaxTracking: false,     // Ensures XHR calls are traced automatically
    enableRequestHeaderTracking: true,  // Captures request headers
    enableResponseHeaderTracking: true, // Captures response headers
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C, // Ensure trace context is propagated. This is the default value anyway.
    enableUnhandledPromiseRejectionTracking: true, // Track unhandled promise rejections
    samplingPercentage: 100, // Log only 20% of sessions
  },
});

appInsights.loadAppInsights();

// Track initial page load
appInsights.trackPageView();


// Ensure all errors are logged, even if they are in a sampled-out session
appInsights.addTelemetryInitializer((envelope: ITelemetryItem) => {
  if (envelope.baseType === "ExceptionData") {   
    if (!envelope.data) {
      envelope.data = {};
    }
    envelope.data["forceLogging"] = true; // Custom property to indicate forced logging
  }
});

// Automatically track global errors
window.addEventListener("error", (event) => {
  appInsights.trackException({
    exception: event.error,
    severityLevel: 3, // Warning level
    properties: { message: event.message, source: event.filename, line: event.lineno, column: event.colno },
  });
});

// Automatically track unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  appInsights.trackException({
    exception: event.reason,
    severityLevel: 3, // Warning level
    properties: { message: event.reason?.message || "Unhandled Promise Rejection" },
  });
});

export default appInsights;
