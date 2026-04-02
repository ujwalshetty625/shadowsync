const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

let items = [
  { id: 1, name: "Widget A", price: 29.99, stock: 50 },
  { id: 2, name: "Widget B", price: 49.99, stock: 20 },
  { id: 3, name: "Widget C", price: 9.99, stock: 100 },
];

app.get("/health", (req, res) => res.json({ status: "ok", version: "v1", uptime: process.uptime() }));
app.get("/items", (req, res) => res.json({ items, total: items.length }));
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  item ? res.json(item) : res.status(404).json({ error: "Item not found" });
});
app.post("/items", (req, res) => {
  const item = { id: items.length + 1, ...req.body };
  items.push(item);
  res.status(201).json(item);
});
app.delete("/items/:id", (req, res) => {
  const idx = items.findIndex((i) => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  items.splice(idx, 1);
  res.json({ deleted: true });
});

app.listen(PORT, () => console.log(`✅ Main App v1 on :${PORT}`));
