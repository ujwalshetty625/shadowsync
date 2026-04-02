const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3002;

// BUG_MODE=true triggers intentional failures for demo
// BUG_TYPE: "crash" | "wrong_data" | "slow"
const BUG_MODE = process.env.BUG_MODE === "true";
const BUG_TYPE = process.env.BUG_TYPE || "crash";

let items = [
  { id: 1, name: "Widget A", price: 29.99, stock: 50 },
  { id: 2, name: "Widget B", price: 49.99, stock: 20 },
  { id: 3, name: "Widget C", price: 9.99, stock: 100 },
];

const injectBug = async (res, normalFn) => {
  if (!BUG_MODE) return normalFn();
  if (BUG_TYPE === "crash") return res.status(500).json({ error: "v2 internal crash 💥" });
  if (BUG_TYPE === "slow") {
    await new Promise((r) => setTimeout(r, 4000)); // timeout bait
    return normalFn();
  }
  return normalFn(); // wrong_data handled per-route
};

app.get("/health", (req, res) => res.json({ status: "ok", version: "v2-shadow", bugMode: BUG_MODE }));

app.get("/items", async (req, res) => {
  await injectBug(res, () => res.json({ items, total: items.length }));
});

app.get("/items/:id", async (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });

  await injectBug(res, () => {
    // BUG: wrong_data - corrupted price calculation
    const data = BUG_TYPE === "wrong_data" ? { ...item, price: item.price * -1, stock: 0 } : item;
    res.json(data);
  });
});

app.post("/items", async (req, res) => {
  await injectBug(res, () => {
    const item = { id: items.length + 1, ...req.body };
    items.push(item);
    res.status(201).json(item);
  });
});

app.delete("/items/:id", async (req, res) => {
  await injectBug(res, () => {
    const idx = items.findIndex((i) => i.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    items.splice(idx, 1);
    res.json({ deleted: true });
  });
});

app.listen(PORT, () => console.log(`🌑 Shadow App v2 on :${PORT} [BUG_MODE: ${BUG_MODE}]`));
