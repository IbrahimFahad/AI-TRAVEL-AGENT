import OpenAI from "openai";
import express from "express";
import cors from "cors";
import {
  getCurrentWeather,
  getgflightOptions,
  gethotelRecommendations,
  functions,
} from "./tools.js";

const app = express();
app.use(cors());
app.use(express.json());
app.post("/trip", async (req, res) => {
  try {
    const data = req.body;
    const numberOfTravelers = data.numberOfTravelers;
    const from = data.from;
    const to = data.to;
    const budget = data.budget;
    const travelDates = data.fromDate + " to " + data.toDate;
    const finalContent = await agent(
      from,
      to,
      travelDates,
      numberOfTravelers,
      budget
    );

    console.log("Final response:", finalContent);

    res.json({
      message: "Trip data received successfully",
      data: finalContent,
    });
  } catch (err) {
    console.error("Error in /trip route:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const availableFunctions = {
  getCurrentWeather,
  gethotelRecommendations,
  getgflightOptions,
};

const systemPrompt = `
You are a travel assistant. Your goal is to provide complete trip information including flights, hotels, and weather.

Rules:
1. For each type of data (flights, hotels, weather), only call the corresponding function if you do not already have this information.
2. Do not repeat function calls that you have already completed unless new information is needed.
3. Always provide the most relevant and complete answer based on the data already gathered.
4. Use the following functions only when needed:

- getCurrentWeather: Returns the current weather at the destination.
  Example: getCurrentWeather: Paris

- gethotelRecommendations: Returns hotel options based on destination, budget, travelers, and dates.
  Example: gethotelRecommendations: { destination: "Paris", budget: 2000, travelers: 2, travelDates: {from: "2025-01-01", to: "2025-01-05"} }

- getgflightOptions: Returns flight options based on origin, destination, travelers, and dates.
  Example: getgflightOptions: { from: "NYC", to: "Paris", travelers: 2, travelDates: {from: "2025-01-01", to: "2025-01-05"} }

Example session:

User: Plan a trip from NYC to Paris for 2 travelers between 2025-01-01 and 2025-01-05 with a budget of 2000.

Thought: I need flights, hotels, and weather, but I don’t have any data yet.

Action: getgflightOptions: { from: "NYC", to: "Paris", travelers: 2, travelDates: {from: "2025-01-01", to: "2025-01-05"} }
PAUSE

Observation: { flights: ["Option 1", "Option 2"] }

Thought: Flights are ready. Next, I need hotel recommendations.

Action: gethotelRecommendations: { destination: "Paris", budget: 2000, travelers: 2, travelDates: {from: "2025-01-01", to: "2025-01-05"} }
PAUSE

Observation: { hotels: ["Hotel 1", "Hotel 2"] }

Thought: Now I need the weather. I haven’t checked it yet.

Action: getCurrentWeather: Paris
PAUSE

Observation: { location: "Paris", forecast: ["sunny", "15°C"] }

Answer: Based on the flights, hotels, and current weather, I recommend Option 2 flight, stay at Hotel 2, and enjoy sunny weather with 15°C.
`;

const messages = [
  {
    role: "system",
    content: systemPrompt,
  },
];

async function agent(from, to, travelDates, numberOfTravelers, budget) {
  messages.push({
    role: "user",
    content: `Plan a trip from ${from} to ${to} for ${numberOfTravelers} travelers between ${travelDates} with a budget of ${budget}. Provide flight options, hotel recommendations, and current weather at the destination.`,
  });

  console.log("=== Sending request to OpenAI ===");
  console.log(JSON.stringify(messages, null, 2));

  const MAX_ITERATIONS = 5;
  const tripData = {
    flights: null,
    hotel: null,
    weather: null,
  };

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    console.log(`Iteration #${i + 1}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      functions,
      function_call: "auto",
    });

    const message = response.choices[0].message;
    const finish = response.choices[0].finish_reason;

    console.log("OpenAI finish_reason:", finish);
    console.log("Message:", message);

    if (finish === "function_call") {
      const fnName = message.function_call.name;
      const fnArgs = JSON.parse(message.function_call.arguments);

      console.log(`Calling function ${fnName} with args:`, fnArgs);

      const functionResponse = await availableFunctions[fnName](fnArgs);

      if (fnName === "getgflightOptions") tripData.flights = functionResponse;
      if (fnName === "gethotelRecommendations")
        tripData.hotel = functionResponse;
      if (fnName === "getCurrentWeather") tripData.weather = functionResponse;

      console.log("Output function", functionResponse);

      messages.push({
        role: "assistant",
        content: `Observation: ${JSON.stringify(functionResponse)} `,
      });
      console.log("Message:", message);
    } else if (finish === "stop") {
      return tripData;
    }
  }

  return tripData;
}
