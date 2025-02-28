import type { ApplicationInsights } from "@microsoft/applicationinsights-web";

export class WebClient {
    private _apiRoot: string;
    private _appInsights?: ApplicationInsights;

    constructor(apiRoot: string, appInsights?: ApplicationInsights) {
        this._apiRoot = apiRoot;
        this._appInsights = appInsights;
    }

    public get = async (endpoint: string): Promise<Response> => {
        const startTime = performance.now();
        try {
            const response = await fetch(`${this._apiRoot}/${this.trimSlashes(endpoint)}`);

            if(this._appInsights) {
                this._appInsights.trackTrace({
                    message: "API call successful",
                    severityLevel: 1, // Info level
                    properties: { endpoint: endpoint, duration: performance.now() - startTime }
                })
            }

            return response;
        }
        catch (error) {
            if(this._appInsights) {
                this._appInsights.trackException({ exception: error as Error});

                this._appInsights.trackTrace({
                    message: "API call failed",
                    severityLevel: 3, // Error level
                    properties: { endpoint: endpoint, error: (error as Error).message }
                });
            }
            console.error("API request error: ", error);
            throw error;
        }
    };

    public fetchData = async(endpoint: string): Promise<Response> => {

        const t1 = (new Date()).getTime();

        const response = await fetch(`${this._apiRoot}/${this.trimSlashes(endpoint)}`, {
            headers: {
              "Content-Type": "application/json",
 //             "traceparent": this._appInsights!.context.telemetryTrace.traceID!, // Ensure trace context is passed
            },
          });
        
        //   this._appInsights?.trackDependencyData({
        //     id: this._appInsights?.context.telemetryTrace.parentID || "default-span",
        //     target: "your-api.com",
        //     name: "FetchWeather",
        //     duration: ((new Date()).getTime() - t1)/1000, // Adjust based on actual request time
        //     success: response.ok,
        //     responseCode: response.status,
        //     properties: { traceId: this._appInsights!.context.telemetryTrace.traceID },
        //   });
        
          return response;        
    };
        
    /// Private methods
    protected trimSlashes = (path: string): string => path.replace(/^\/|\/$/g, '');
}