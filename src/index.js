import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/weather', (req, res) => {
  res.json({
    city: "Delhi",
    temperature: 32,
    description: "Sunny (hardcoded)",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
