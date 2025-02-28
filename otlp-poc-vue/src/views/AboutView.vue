<script setup lang="ts">
import { WebClient } from "@/api/webClient";
import appInsights from "../appInsights";
import { ref } from "vue";

const webClient = new WebClient();
const api1 = "https://localhost:8000";
const messag = ref("");


const noAction = () => {
};

const uiException = () => {
    throw new Error("Throwing UI exception.");
};


const trackTrace = () => {
  appInsights.trackTrace({
    message: "User clicked the button",
    severityLevel: 1, // 0 = Verbose, 1 = Information, 2 = Warning, 3 = Error, 4 = Critical
    properties: { action: "button_click", component: "AboutView" },
  });
  console.log("Custom trace sent to Azure Monitor");
};


const call200 = async () => {
  const response = await webClient.fetchData(`${api1}/WeatherForecast`);
  messag.value = `Response: ${response.status}`;
};

const call404 = async () => {
  const response = await webClient.fetchData(`${api1}/NotExistingEndpoint`);
  messag.value = `Response: ${response.status}`;
};

</script>

<template>
  <div>
    <h1>Triggers</h1>
    <button @click="noAction">No Action</button>
    <button @click="uiException">UI Exception</button>
    <button @click="trackTrace">Track Trace</button>
    <button @click="call200">Call 200</button>
    <button @click="call404">Call 404</button>

    <div class="info">{{ messag }}</div>

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
