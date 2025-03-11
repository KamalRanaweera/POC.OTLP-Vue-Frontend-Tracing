import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SimpleSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";

// 🔹 Replace with your Azure Monitor Instrumentation Key or Connection String
const connectionString = import.meta.env.VITE_AZURE_MONITOR_CONNECTION_STRING;

// 🔹 Initialize Application Insights
const appInsights = new ApplicationInsights({
  config: {
    connectionString,
    enableAutoRouteTracking: true, // Tracks page views automatically
    disableFetchTracking: false, // Enables fetch API tracing
    disableAjaxTracking: false, // Enables XHR tracking
    distributedTracingMode: 1, // Ensures distributed tracing compatibility
  },
});

appInsights.loadAppInsights();

// 🔹 Initialize OpenTelemetry Tracer Provider
const provider = new WebTracerProvider();

// 🔹 Add an OpenTelemetry Span Processor
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter())); // Logs spans to the console (for debugging)

// 🔹 Custom Span Processor to send traces to Application Insights
provider.addSpanProcessor(
  new SimpleSpanProcessor({
    export: (span: { name: any; attributes: any; }) => {
      appInsights.trackTrace({
        message: span.name,
        properties: span.attributes,
      });
    },
  } as any) // 🔹 TypeScript workaround (since OpenTelemetry expects an actual SpanProcessor)
);

provider.register();

// 🔹 Enable Automatic Instrumentation
new FetchInstrumentation();
new DocumentLoadInstrumentation();
new UserInteractionInstrumentation();

console.log("✅ OpenTelemetry configured for Azure Monitor!");
