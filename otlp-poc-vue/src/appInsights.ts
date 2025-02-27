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
  },
});

appInsights.loadAppInsights();
appInsights.trackPageView(); // Track initial page load

export default appInsights;
