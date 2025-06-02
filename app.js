const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Supabase client
const supabase = createClient(
  'https://rawhhwcabfwycqzhmrdi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhd2hod2NhYmZ3eWNxemhtcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDAxNzUsImV4cCI6MjA2NDM3NjE3NX0.wAoMkrMMKrH-rRMsPYWZazMfmBh50whgNNg6hfHJVqY'
);

// Rotas
app.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select();
  if (error) return res.status(500).send(error);
  res.send(data);
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').select().eq('id', id);
  if (error) return res.status(500).send(error);
  res.send(data);
});

app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;
  const { error } = await supabase.from('products').insert({ name, description, price });
  if (error) return res.status(500).send(error);
  res.send("Created!");
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const { error } = await supabase
    .from('products')
    .update({ name, description, price })
    .eq('id', id);
  if (error) return res.status(500).send(error);
  res.send("Updated!");
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).send(error);
  res.send("Deleted!");
});

app.get('/', (req, res) => {
  res.send("Hello I am working, my friend Supabase <3");
});

app.get('*', (req, res) => {
  res.send("Hello again I am working my friend to the moon and beyond <3");
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('> Ready on http://localhost:3000');
});
