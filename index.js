const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');

// Inisialisasi Express
const app = express();
const port = process.env.PORT || 3000;

// Gunakan bodyParser untuk memparse JSON
app.use(bodyParser.json());

// Inisialisasi Firebase Admin SDK
const serviceAccountString = process.env.SERVICE_ACCOUNT_KEY;

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

// Endpoint untuk mengirim pesan
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;

  // Cek jika data ada
  if (!token || !title || !body) {
    return res.status(400).send({ error: 'Missing token, title, or body' });
  }

  const message = {
    notification: {
      title: title,
      body: body
    },
    token: token
  };

  try {
    // Kirim notifikasi menggunakan Firebase Admin SDK
    const response = await firebaseAdmin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).send({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ error: 'Error sending message' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
