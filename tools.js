import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getCurrentWeather(location) {
  const apiKey = "5c1b22b3832ef1a53f0eb753905175b7";

  const CurrentWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=metric`
  );

  const weatherData = await CurrentWeather.json();

  const messages = [
    {
      role: "system",
      content:
        "You are a friendly weather assistant. When given basic weather data such as the low and high temperatures, conditions (sunny, rainy, cloudy, etc.), and location, provide a concise, human-readable weather summary. Include: \n- Temperature in °C or °F\n- General description of how the weather will feel\n- Any suggestions or notes if appropriate (e.g., light jacket recommended, mild weather, warm day, etc.)\n\nExample output: 'You can expect the weather to be quite mild. Low will be 19° and high will be 25°.'\n\nAlways write in a natural, conversational tone.",
    },
  ];

  massages.push({
    role: "user",
    content: weatherData,
  });

  const response = await OpenAI.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  return response;
}

export async function gethotelRecommendations(
  destination,
  budget,
  travelDates,
  numberOfTravelers
) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful travel assistant that provides personalized hotel recommendations. You do not have access to live hotel databases, so you must generate plausible and realistic hotel suggestions based on the user's input. Consider the following criteria:\n\n- destination: the city or location where the user wants to stay\n- budget: the approximate budget range for the stay\n- travelDates: the check-in and check-out dates\n- numberOfTravelers: total number of people traveling\n\nProvide a list of 1 hotel for the user. , include:\n- hotel name (realistic but can be fictional if necessary)\n- approximate nightly price\n- star rating\n- a brief description including key amenities (pool, free breakfast, Wi-Fi, etc.)\n- suitability for the travel group (e.g., family-friendly, couple-friendly, business travelers)\n\nMake the recommendations clear, concise, and helpful, as if a real travel assistant were guiding the user.",
    },
  ];

  massages.push({
    role: "user",
    content: `Provide hotel recommendations for a trip to ${destination} for ${numberOfTravelers} travelers from ${travelDates} with a budget of ${budget}.`,
  });

  const response = await OpenAI.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  return response;
}

export async function getgflightOptions(
  flyingFrom,
  flyingTo,
  travelDates,
  numberOfTravelers,
  budget
) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful travel assistant that provides personalized flight options. You do not have access to live airline databases, so you must generate plausible and realistic flight suggestions based on the user's input. Consider the following criteria:\n\n- origin: the city or airport the user is departing from\n- destination: the city or airport the user wants to travel to\n- travelDates: departure and return dates\n- numberOfTravelers: total passengers\n- travelClass: economy, business, or first class (optional)\n\nProvide a list of 1 flight option.  include:\n- airline name (realistic or commonly known)\n- flight number (plausible format)\n- departure and arrival times\n- duration\n- number of stops (direct, 1 stop, etc.)\n- approximate price per passenger\n- brief notes if relevant (e.g., overnight flight, early morning, best value, etc.)\n\nMake the recommendations clear, concise, and helpful, as if a real travel agent were guiding the user.",
    },
  ];

  massages.push({
    role: "user",
    content: `Provide flight recommendations for a trip to ${destination} for ${numberOfTravelers} travelers from ${travelDates} with a budget of ${budget}.`,
  });

  const response = await OpenAI.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  return response;
}

export const functions = [
  {
    function: getCurrentWeather,
    parse: JSON.parse,
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The name of the city from where to get the weather",
        },
      },
      required: ["location"],
    },
  },

  {
    function: gethotelRecommendations,
    parse: JSON.parse,

    parameters: {
      type: "object",
      properties: {
        flyingTo: {
          type: "string",
          description: "The city or location where the user wants to stay",
        },
        budget: {
          type: "string",
          description: "The approximate budget range for the stay",
        },
        travelDates: {
          type: "string",
          description: "The check-in and check-out dates",
        },
        numberOfTravelers: {
          type: "number",
          description: "Total number of people traveling",
        },
      },
    },
  },

  {
    function: getgflightOptions,
    parse: JSON.parse,
    parameters: {
      type: "object",
      properties: {
        flyingTo: {
          type: "string",
          description: "The city or location where the user wants to stay",
        },
        budget: {
          type: "string",
          description: "The approximate budget range for the stay",
        },
        travelDates: {
          type: "string",
          description: "The check-in and check-out dates",
        },
        numberOfTravelers: {
          type: "number",
          description: "Total number of people traveling",
        },
      },
    },
  },
];
