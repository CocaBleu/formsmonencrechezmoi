// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  const { model } = req.body;

  if (!model) {
    return res.status(400).json({ error: 'Missing printer model' });
  }

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert des imprimantes et des cartouches compatibles.',
        },
        {
          role: 'user',
          content: `Quel est le numéro des cartouches compatibles avec l'imprimante "${model}" ? Réponds uniquement avec les références.`,
        },
      ],
      temperature: 0.3,
    });

    const reply = chatCompletion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de l’appel à OpenAI.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
