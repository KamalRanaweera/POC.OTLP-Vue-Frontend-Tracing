<script setup lang="ts">
import appInsights from "../appInsights";

const trackCustomEvent = () => {
  appInsights.trackEvent({ name: "ButtonClicked", properties: { button: "Track Event" } });
  console.log("Custom event sent to Azure Monitor");
};

const trackError = () => {
  try {
    throw new Error("Something went wrong!");
  } catch (error) {
    appInsights.trackException({ exception: error as Error });
    console.log("Custom exception sent to Azure Monitor");
  }
};


const trackTrace = () => {
  appInsights.trackTrace({
    message: "User clicked the button",
    severityLevel: 1, // 0 = Verbose, 1 = Information, 2 = Warning, 3 = Error, 4 = Critical
    properties: { action: "button_click", component: "AboutView" },
  });
  console.log("Custom trace sent to Azure Monitor");
};

</script>

<template>
  <div>
    <h1>Triggers</h1>
    <button @click="trackCustomEvent">Track Event</button>
    <button @click="trackError">Track Error</button>
    <button @click="trackTrace">Track Trace</button>
  </div>

</template>

<style>

button {
  margin:5px;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
