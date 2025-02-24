import { ApplicationInsights } from "@microsoft/applicationinsights-web";


// Replace with your Azure Monitor Instrumentation Key
const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_AZURE_MONITOR_CONNECTION_STRING,
    enableAutoRouteTracking: true, // Enables automatic route changes tracking
  },
});

appInsights.loadAppInsights();
appInsights.trackPageView(); // Track initial page load

export default appInsights;
