import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import "./appInsights"; // Import Application Insights setup

import appInsights from "./appInsights";

// Reporting button clicks
document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "BUTTON") {
  
        // Generate a new trace ID for this button click
        const currentTraceId = appInsights.context.telemetryTrace.traceID!;
        const currentSpanId = appInsights.context.telemetryTrace.parentID!;  
  
        appInsights.trackEvent({ 
            name: "ButtonClick", 
            properties: { 
                buttonText: target.innerText || "Unknown Button",
                buttonId: target.id || "No ID",
                classList: target.className || "No Class",
                traceId: currentTraceId,
                spanId: currentSpanId,
            }
        });
  
        console.log(`Button clicked (appInsights.ts): ${target.innerText}, Trace ID: ${currentTraceId}, Span ID: ${currentSpanId}`);
    }
  });
    
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
