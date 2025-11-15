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

    res.json({
      message: "Trip data received successfully",
      data: data,
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

const numberOfTravelers = data.numberOfTravelers;
const from = data.from;
const destination = data.to;
const budget = data.budget;
const fromDate = data.fromDate;
const toDate = data.toDate;

const messages = [
  {
    role: "system",
    content:
      "You are an AI travel agent that helps users plan their trips by providing flight options, hotel recommendations, and weather updates for their destinations Transform technical data into engaging, conversational responses, but only include the normal information a regular person might want unless they explicitly ask for more. Provide highly specific answers based on the information you're given. Prefer to gather information with the tools provided to you rather than giving basic, generic answers.",
  },
];

async function agent(
  from,
  destination,
  budget,
  fromDate,
  toDate,
  numberOfTravelers
) {
  messages.push({
    role: "user",
    content: `Plan a trip from ${from} to ${destination} for ${numberOfTravelers} travelers between ${fromDate} and ${toDate} with a budget of ${budget}. Provide flight options, hotel recommendations, and current weather at the destination.`,
  });

  const response = await openai.beta.chat.completions.runFunctions({
    model: "gpt-4o",
    messages,
    functions,
  });
}
