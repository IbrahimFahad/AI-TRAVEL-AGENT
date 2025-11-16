import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getCurrentWeather({ location }) {
  const apiKey = "5c1b22b3832ef1a53f0eb753905175b7";

  const CurrentWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=metric`
  );

  const weatherData = await CurrentWeather.json();

  return `Current weather in ${location}: ${weatherData.weather[0].description}, temperature ${weatherData.main.temp}°C.`;
}

export async function gethotelRecommendations({
  from,
  to,
  travelDates,
  numberOfTravelers,
  budget,
}) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful travel assistant. Invent hotels and prices — they do NOT need to be real. Just sound realistic and only give one best hotel Recommendation , and give a nice tone respoend .",
    },
  ];

  messages.push({
    role: "user",
    content: `Give 1 fake hotel recommendation in ${to} for ${numberOfTravelers} people on ${travelDates} with budget ${budget}.`,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  return response.choices[0].message.content;
}

export async function getgflightOptions({
  from,
  to,
  travelDates,
  numberOfTravelers,
  budget,
}) {
  {
    const messages = [
      {
        role: "system",
        content:
          "You are a travel assistant. Create made‑up but realistic flight details (airlines, flight numbers, times, prices). They do NOT need to match real-world data. and only give one best hotel Recommendation , and give a nice tone respoend",
      },
    ];

    messages.push({
      role: "user",
      content: `Provide flight recommendations for a trip from ${from} to ${to} for ${numberOfTravelers} travelers between ${travelDates} with a budget of ${budget}.`,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    return response.choices[0].message.content;
  }
}

export const functions = [
  {
    name: "getCurrentWeather",
    description: "Get the current weather for a given city",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
      },
      required: ["location"],
    },
  },
  {
    name: "gethotelRecommendations",
    description: "Provide hotel recommendations for a destination",
    parameters: {
      type: "object",
      properties: {
        from: { type: "string" },
        to: { type: "string" },
        budget: { type: "string" },
        travelDates: { type: "string" },
        numberOfTravelers: { type: "number" },
      },
      required: ["from", "to", "budget", "travelDates", "numberOfTravelers"],
    },
  },
  {
    name: "getgflightOptions",
    description: "Provide flight options for a trip",
    parameters: {
      type: "object",
      properties: {
        from: { type: "string" },
        to: { type: "string" },
        travelDates: { type: "string" },
        numberOfTravelers: { type: "number" },
        budget: { type: "string" },
      },
      required: ["from", "to", "travelDates", "numberOfTravelers", "budget"],
    },
  },
];
