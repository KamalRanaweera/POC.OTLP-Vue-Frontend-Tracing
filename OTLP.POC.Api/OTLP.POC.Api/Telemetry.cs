using System.Diagnostics;

namespace OTLP.POC.Api
{
    public static class Telemetry
    {
        public static readonly ActivitySource ActivitySource = new("OTLP.POC.Api");
    }
}
