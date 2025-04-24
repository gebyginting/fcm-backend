import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Load Firebase credentials from environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔁 Routes
app.get('/', (req, res) => {
  res.send('✅ FCM Backend is running!');
});

app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: { title, body },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🌐 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
