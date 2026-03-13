import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("store.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price REAL NOT NULL,
    compare_price REAL,
    stock_quantity INTEGER DEFAULT 0,
    category TEXT,
    delivery_type TEXT,
    image_url TEXT,
    sku TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'unpaid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS ad_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL,
    cost REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed initial data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, slug, short_description, price, compare_price, stock_quantity, category, delivery_type, image_url, sku, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProduct.run("Windows 11 Pro Retail Key", "windows-11-pro", "Official Microsoft Windows 11 Pro Retail License Key.", 199.99, 249.99, 500, "Operating Systems", "Instant Email", "https://picsum.photos/seed/win11/800/600", "MS-W11-PRO", "active");
  insertProduct.run("Adobe Creative Cloud 1 Year", "adobe-cc-1yr", "Full access to all Adobe apps for 12 months.", 599.99, 699.99, 50, "Design", "Account Activation", "https://picsum.photos/seed/adobe/800/600", "AD-CC-1YR", "active");
  insertProduct.run("JetBrains All Products Pack", "jetbrains-all", "The complete suite of JetBrains IDEs.", 249.00, 299.00, 100, "Developer Tools", "License Key", "https://picsum.photos/seed/jetbrains/800/600", "JB-ALL-PP", "active");
  insertProduct.run("AutoCAD 2024 Subscription", "autocad-2024", "Professional 2D and 3D CAD software.", 1690.00, 1850.00, 20, "Engineering", "License Key", "https://picsum.photos/seed/autocad/800/600", "AC-2024-SUB", "active");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products WHERE status = 'active'").all();
    res.json(products);
  });

  app.get("/api/products/:slug", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
    if (product) res.json(product);
    else res.status(404).json({ error: "Product not found" });
  });

  app.post("/api/orders", (req, res) => {
    const { customer_name, customer_email, items, total_amount } = req.body;
    const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const insertOrder = db.prepare("INSERT INTO orders (order_number, customer_name, customer_email, total_amount, payment_status) VALUES (?, ?, ?, ?, ?)");
    const result = insertOrder.run(orderNumber, customer_name, customer_email, total_amount, 'paid');
    const orderId = result.lastInsertRowid;

    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    for (const item of items) {
      insertItem.run(orderId, item.id, item.quantity, item.price);
    }

    res.json({ success: true, orderNumber, orderId });
  });

  // Admin API Routes
  app.get("/api/admin/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/admin/products", (req, res) => {
    const { name, slug, short_description, full_description, price, compare_price, stock_quantity, category, delivery_type, image_url, sku, status } = req.body;
    try {
      const insert = db.prepare(`
        INSERT INTO products (name, slug, short_description, full_description, price, compare_price, stock_quantity, category, delivery_type, image_url, sku, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(name, slug, short_description, full_description, price, compare_price, stock_quantity, category, delivery_type, image_url, sku, status || 'active');
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/products/:id", (req, res) => {
    const { name, slug, short_description, full_description, price, compare_price, stock_quantity, category, delivery_type, image_url, sku, status } = req.body;
    try {
      const update = db.prepare(`
        UPDATE products SET 
          name = ?, slug = ?, short_description = ?, full_description = ?, 
          price = ?, compare_price = ?, stock_quantity = ?, category = ?, 
          delivery_type = ?, image_url = ?, sku = ?, status = ?
        WHERE id = ?
      `);
      update.run(name, slug, short_description, full_description, price, compare_price, stock_quantity, category, delivery_type, image_url, sku, status, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    res.json(orders);
  });

  app.get("/api/admin/customers", (req, res) => {
    const customers = db.prepare(`
      SELECT 
        customer_email as email, 
        customer_name as name, 
        COUNT(*) as order_count, 
        SUM(total_amount) as total_spent,
        MAX(created_at) as last_order
      FROM orders 
      GROUP BY customer_email
      ORDER BY total_spent DESC
    `).all();
    res.json(customers);
  });

  app.get("/api/admin/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM settings").all();
      const settingsMap = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", (req, res) => {
    try {
      const updates = req.body;
      const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      const transaction = db.transaction((data) => {
        for (const [key, value] of Object.entries(data)) {
          stmt.run(key, value);
        }
      });
      transaction(updates);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Admin Analytics
  app.get("/api/admin/stats", (req, res) => {
    const totalSales = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'").get() as { total: number };
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
    const recentOrders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5").all();
    
    // Mock daily sales for chart
    const dailyRevenue = [
      { date: '2026-03-06', revenue: 1200, cost: 400 },
      { date: '2026-03-07', revenue: 1900, cost: 600 },
      { date: '2026-03-08', revenue: 1500, cost: 500 },
      { date: '2026-03-09', revenue: 2100, cost: 700 },
      { date: '2026-03-10', revenue: 2500, cost: 800 },
      { date: '2026-03-11', revenue: 2200, cost: 750 },
      { date: '2026-03-12', revenue: 2800, cost: 900 },
    ];

    res.json({
      totalSales: totalSales.total || 0,
      totalOrders: totalOrders.count || 0,
      recentOrders,
      dailyRevenue
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
