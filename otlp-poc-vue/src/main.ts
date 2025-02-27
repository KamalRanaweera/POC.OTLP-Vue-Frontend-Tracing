import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "./appInsights"; // Import Application Insights setup
import appInsights from './appInsights'

const app = createApp(App)

// Store trace context for ongoing operations
let currentTraceId: string | null = null;
let currentSpanId: string | null = null;

// Track all button clicks
document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "BUTTON") {

        // Generate a new trace ID for this button click
        currentTraceId = appInsights.context.telemetryTrace.traceID!;
        currentSpanId = appInsights.context.telemetryTrace.parentID!;  

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

        console.log(`Button clicked: ${target.innerText}, Trace ID: ${currentTraceId}, Span ID: ${currentSpanId}`);
    }
  });
  

app.use(createPinia())
app.use(router)

app.mount('#app')
