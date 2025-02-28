import { ApplicationInsights, DistributedTracingModes } from "@microsoft/applicationinsights-web";


// Replace with your Azure Monitor Instrumentation Key
const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_AZURE_MONITOR_CONNECTION_STRING,
    enableAutoRouteTracking: true, // Enables automatic route changes tracking
    disableFetchTracking: false,   // Enable automatic fetch() tracking
    disableAjaxTracking: false,    // Enable automatic XHR tracking
    distributedTracingMode: DistributedTracingModes.W3C, // Ensure trace context is propagated
    enableCorsCorrelation: true,   // Enable tracing across CORS requests
    enableUnhandledPromiseRejectionTracking: true, // Track unhandled promise rejections
  },
});

appInsights.loadAppInsights();
appInsights.trackPageView(); // Track initial page load

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
