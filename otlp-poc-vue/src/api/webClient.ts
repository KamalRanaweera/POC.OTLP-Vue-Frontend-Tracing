import type { ApplicationInsights } from "@microsoft/applicationinsights-web";

export class WebClient {

    constructor() {
    }

    public fetchData = async(endpoint: string): Promise<Response> => {

        const response = await fetch(endpoint, { 
            headers: {
              "Content-Type": "application/json",
            },
          });
        
          return response;        
    };
        
}