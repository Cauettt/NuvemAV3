const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Supabase client
const supabase = createClient(
  "https://rawhhwcabfwycqzhmrdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhd2hod2NhYmZ3eWNxemhtcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDAxNzUsImV4cCI6MjA2NDM3NjE3NX0.wAoMkrMMKrH-rRMsPYWZazMfmBh50whgNNg6hfHJVqY"
);

// Rotas
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select();
  if (error) return res.status(500).json(error); // Return JSON error
  res.json(data); // Return JSON data
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("products").select().eq("id", id);
  if (error) return res.status(500).json(error); // Return JSON error
  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Product not found" }); // Handle not found
  }
  res.json(data[0]); // Return single product object as JSON
});

app.post("/products", async (req, res) => {
  const { name, description, price } = req.body;
  // Attempt to insert and select the new row in one go if needed, or just return success
  const { data, error } = await supabase
    .from("products")
    .insert({ name, description, price })
    .select(); // Add .select() to get the inserted data

  if (error) return res.status(500).json(error); // Return JSON error
  
  // Return the newly created product data as JSON
  if (data && data.length > 0) {
      res.status(201).json(data[0]); // 201 Created status and return the object
  } else {
      // Fallback if select() doesn't return data (depends on Supabase version/config)
      res.status(201).json({ message: "Product created successfully" }); 
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const { data, error } = await supabase
    .from("products")
    .update({ name, description, price })
    .eq("id", id)
    .select(); // Add .select() to get the updated data

  if (error) return res.status(500).json(error); // Return JSON error

  // Check if the update affected any row and return the updated product
  if (data && data.length > 0) {
      res.json(data[0]); // Return the updated object
  } else {
      // If no row was updated (e.g., ID not found), return 404
      res.status(404).json({ message: "Product not found or no changes made" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { error, count } = await supabase
    .from("products")
    .delete({ count: 'exact' }) // Request count of deleted rows
    .eq("id", id);

  if (error) return res.status(500).json(error); // Return JSON error

  // Check if a row was actually deleted
  if (count > 0) {
      res.json({ message: "Product deleted successfully" }); // Return JSON success message
  } else {
      res.status(404).json({ message: "Product not found" }); // Return 404 if not found
  }
});

app.get("/", (req, res) => {
  res.send("Hello I am working, my friend Supabase <3");
});

app.get("*", (req, res) => {
  res.send("Hello again I am working my friend to the moon and beyond <3");
});

// Inicia o servidor
const PORT = process.env.PORT || 3000; // Use environment variable or default
app.listen(PORT, "0.0.0.0", () => { // Listen on 0.0.0.0
  console.log(`> Ready on http://0.0.0.0:${PORT}`);
});
