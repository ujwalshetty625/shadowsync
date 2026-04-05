const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

let items = [
  { id: 1, name: "Widget A", price: 29.99, stock: 50 },
  { id: 2, name: "Widget B", price: 49.99, stock: 20 },
  { id: 3, name: "Widget C", price: 9.99, stock: 100 },
];

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  try {
    res.json({ status: "ok", version: "v1", uptime: process.uptime() });
  } catch (error) {
    console.error("❌ Health check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /items with pagination and filtering
app.get("/items", (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const search = (req.query.search || "").toLowerCase();
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

    // Filter items
    let filtered = items.filter((item) => {
      const matchesSearch = search === "" || item.name.toLowerCase().includes(search);
      const matchesMinPrice = minPrice === null || item.price >= minPrice;
      const matchesMaxPrice = maxPrice === null || item.price <= maxPrice;
      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    // Pagination
    const total = filtered.length;
    const paginatedItems = filtered.slice((page - 1) * limit, page * limit);

    res.json({
      items: paginatedItems,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ GET /items error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single item by ID
app.get("/items/:id", (req, res) => {
  try {
    const item = items.find((i) => i.id === Number(req.params.id));
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("❌ GET /items/:id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create new item
app.post("/items", (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validation: Check all required fields exist
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "price", "stock"],
      });
    }

    // Validation: Check name is a string
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Name must be a non-empty string" });
    }

    // Validation: Check price is a valid positive number
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    // Validation: Check stock is a valid non-negative integer
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: "Stock must be a non-negative integer" });
    }

    // All good! Create the item
    const item = { id: items.length + 1, name: name.trim(), price, stock };
    items.push(item);
    console.log(`✨ Item created: ${item.id}`);
    res.status(201).json(item);
  } catch (error) {
    console.error("❌ POST /items error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update entire item
app.put("/items/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const idx = items.findIndex((i) => i.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    const { name, price, stock } = req.body;

    // Validation: Check all required fields exist
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "price", "stock"],
      });
    }

    // Validation: Check name
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Name must be a non-empty string" });
    }

    // Validation: Check price
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    // Validation: Check stock
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: "Stock must be a non-negative integer" });
    }

    // Update item
    items[idx] = { id, name: name.trim(), price, stock };
    console.log(`🔄 Item updated: ${id}`);
    res.json(items[idx]);
  } catch (error) {
    console.error("❌ PUT /items/:id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update specific fields
app.patch("/items/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const idx = items.findIndex((i) => i.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    const { name, price, stock } = req.body;

    // Validate individual fields if provided
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Name must be a non-empty string" });
      }
      items[idx].name = name.trim();
    }

    if (price !== undefined) {
      if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "Price must be a positive number" });
      }
      items[idx].price = price;
    }

    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ error: "Stock must be a non-negative integer" });
      }
      items[idx].stock = stock;
    }

    console.log(`🔧 Item patched: ${id}`);
    res.json(items[idx]);
  } catch (error) {
    console.error("❌ PATCH /items/:id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE item
app.delete("/items/:id", (req, res) => {
  try {
    const idx = items.findIndex((i) => i.id === Number(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ error: "Item not found" });
    }
    const deleted = items.splice(idx, 1)[0];
    console.log(`🗑️ Item deleted: ${deleted.id}`);
    res.json({ deleted: true, item: deleted });
  } catch (error) {
    console.error("❌ DELETE /items/:id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`✅ Main App v1 on :${PORT}`));
