using Azure.Monitor.OpenTelemetry.AspNetCore;
using Microsoft.Extensions.Configuration;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OTLP.POC.Api;

var builder = WebApplication.CreateBuilder(args);

#region Adding Open Telemetry.

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("POC.OpenTelemetry"))
    .WithMetrics(options =>
    {
        options
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation();

        options.AddOtlpExporter();
    })
    .WithTracing(options =>
    {
        options
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation();

        options.AddOtlpExporter();
    });


builder.Logging.AddOpenTelemetry(options => options.AddOtlpExporter());

//Enable Azure Monitor
bool enableAzureMonitor = builder.Configuration.GetValue<bool>("AzureMonitor:Enable");
if (enableAzureMonitor)
{
    // Filter out unwanted logs to reduce costs
    builder.Logging.AddFilter((category, logLevel) =>
    {
        if (category!.Contains("Microsoft") || category.Contains("System"))
        {
            return logLevel >= LogLevel.Warning; // Drop Verbose/Debug logs for framework components
        }
        return logLevel >= LogLevel.Information; // Keep only important logs for your app
    });

    //Set Azure Monitor as the data storage
    builder.Services.AddOpenTelemetry().UseAzureMonitor(options =>
    {
        options.ConnectionString = builder.Configuration.GetValue<string>("AzureMonitor:ConnectionString");
    });
}

#endregion

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder =>
        {
            builder.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseMiddleware<TelemetryMiddleware>();

app.UseCors("AllowAnyOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
