const axios = require("axios");

const PROXY = "http://localhost:3000";

const endpoints = ["/items", "/items/1", "/items/2"];

const run = async () => {
  for (let i = 0; i < 30; i++) {
    const url = endpoints[i % endpoints.length];

    await axios.get(PROXY + url).catch(() => {});

    console.log(`Request ${i + 1}: GET ${url}`);

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("Done! Check dashboard.");
};

run();