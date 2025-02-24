<script setup lang="ts">
import appInsights from "../appInsights";

const trackCustomEvent = () => {
  appInsights.trackEvent({ name: "ButtonClicked", properties: { button: "Track Event" } });
  console.log("Custom event sent to Azure Monitor");
};

const throwError = () => {
  try {
    throw new Error("Something went wrong!");
  } catch (error) {
    appInsights.trackException({ exception: error as Error });
    console.log("Custom exception sent to Azure Monitor");
  }
};

</script>

<template>
  <div>
    <h1>Triggers</h1>
    <button @click="trackCustomEvent">Track Event</button>
    <button @click="throwError">Throw Error</button>
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
