const axios = require("axios");

const PROXY = "http://localhost:3000";

const run = async () => {
  console.log(" Starting load test against ShadowSync Proxy...\n");

  const endpoints = [
    { method: "GET", path: "/items" },
    { method: "GET", path: "/items/1" },
    { method: "GET", path: "/items/2" },
    { method: "GET", path: "/items/3" },
    { method: "GET", path: "/items/999" }, // 404 test
    { method: "POST", path: "/items", data: { name: "Test Widget", price: 19.99, stock: 10 } },
    { method: "GET", path: "/health" },
  ];

  let success = 0;
  let errors = 0;

  for (let i = 0; i < 30; i++) {
    const endpoint = endpoints[i % endpoints.length];
    const config = {
      method: endpoint.method,
      url: PROXY + endpoint.path,
      timeout: 5000,
    };
    if (endpoint.data) {
      config.data = endpoint.data;
    }

    try {
      const response = await axios(config);
      console.log(`✅ Request ${i + 1}: ${endpoint.method} ${endpoint.path} → ${response.status}`);
      success++;
    } catch (error) {
      const status = error.response?.status || "ERROR";
      console.log(`❌ Request ${i + 1}: ${endpoint.method} ${endpoint.path} → ${status}`);
      errors++;
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n📊 Results: ${success} success, ${errors} errors`);
  console.log("💡 Check the dashboard at http://localhost:5173 for comparison results.");
};

run().catch(console.error);