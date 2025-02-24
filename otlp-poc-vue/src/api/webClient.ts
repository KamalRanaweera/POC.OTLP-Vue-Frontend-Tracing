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
    }


    /// Private methods
    private trimSlashes = (path: string): string => path.replace(/^\/|\/$/g, '');
}