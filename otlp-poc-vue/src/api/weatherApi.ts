import type { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { WebClient } from "./webClient";

export class WeatherApi extends WebClient {

    constructor(apiRoot: string, appInsights?: ApplicationInsights) {
        super(apiRoot, appInsights);
    }

  
}