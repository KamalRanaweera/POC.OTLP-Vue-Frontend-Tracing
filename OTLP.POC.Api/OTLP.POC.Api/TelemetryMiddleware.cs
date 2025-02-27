namespace OTLP.POC.Api
{
    public class TelemetryMiddleware
    {
        private readonly RequestDelegate _next;

        public TelemetryMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Headers.TryGetValue("traceparent", out var traceParent))
            {
                Console.WriteLine($"Incoming Trace ID: {traceParent}");
            }

            await _next(context);
        }
    }
}
