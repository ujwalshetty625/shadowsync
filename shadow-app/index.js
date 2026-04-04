const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3002;

// BUG TYPES:
// crash → returns 500
// slow → delays response (~3 seconds, under proxy timeout)
// wrong_data → corrupts values (negative price, zero stock)
// missing_field → removes required fields (price, stock)
// random_failure → randomly fails 30% of requests

const BUG_MODE = process.env.BUG_MODE === "true";
const BUG_TYPE = process.env.BUG_TYPE || "crash";

let items = [
  { id: 1, name: "Widget A", price: 29.99, stock: 50 },
  { id: 2, name: "Widget B", price: 49.99, stock: 20 },
  { id: 3, name: "Widget C", price: 9.99, stock: 100 },
];

// Helper: Apply bug injection to a response
const injectBug = async (res, normalFn) => {
  if (!BUG_MODE) return normalFn();

  if (BUG_TYPE === "crash") {
    return res.status(500).json({ error: "Internal server error" });
  }

  if (BUG_TYPE === "slow") {
    await new Promise((r) => setTimeout(r, 3000)); // 3s delay (under 5s proxy timeout)
    return normalFn();
  }

  if (BUG_TYPE === "random_failure") {
    if (Math.random() < 0.3) {
      return res.status(500).json({ error: "Random failure" });
    }
    return normalFn();
  }

  return normalFn(); // wrong_data and missing_field handled per-route
};

// Helper: Transform item based on bug type
const transformItem = (item) => {
  if (!BUG_MODE) return item;

  if (BUG_TYPE === "wrong_data") {
    return { ...item, price: item.price * -1, stock: 0 };
  }

  if (BUG_TYPE === "missing_field") {
    const { id, name } = item;
    return { id, name }; // omit price and stock
  }

  return item;
};

// Helper: Transform items array based on bug type
const transformItems = (itemsArray) => {
  if (!BUG_MODE) return itemsArray;
  return itemsArray.map(transformItem);
};

// Health endpoint - matches main app format exactly
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: "v2-shadow",
    uptime: process.uptime(),
  });
});

// GET /items - list all items
app.get("/items", async (req, res) => {
  await injectBug(res, () => {
    const transformedItems = transformItems(items);
    res.json({ items: transformedItems, total: items.length });
  });
});

// GET /items/:id - get single item
app.get("/items/:id", async (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });

  await injectBug(res, () => {
    const transformedItem = transformItem(item);
    res.json(transformedItem);
  });
});

// POST /items - create new item
app.post("/items", async (req, res) => {
  await injectBug(res, () => {
    const item = { id: items.length + 1, ...req.body };
    items.push(item);
    res.status(201).json(item);
  });
});

// DELETE /items/:id - delete item
app.delete("/items/:id", async (req, res) => {
  const idx = items.findIndex((i) => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  await injectBug(res, () => {
    items.splice(idx, 1);
    res.json({ deleted: true });
  });
});

app.listen(PORT, () =>
  console.log(`🌑 Shadow App v2 on :${PORT} [BUG_MODE: ${BUG_MODE}]`)
);