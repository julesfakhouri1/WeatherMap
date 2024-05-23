const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Enable CORS for all origins or restrict it to your Angular frontend's URL
app.use(cors({
    origin: 'http://localhost:4200' // Replace with your Angular app's URL if it's different
}));

// Initialize Firebase Admin SDK
const serviceAccount = require('./config/firebaseServiceAccountKey.json'); // Adjust the path as needed
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true }); // Ignore undefined properties

// Routes
app.post('/api/search', async (req, res) => {
    const { address, latitude, longitude, weather } = req.body;

    try {
        const newSearch = {
            address,
            latitude,
            longitude,
            weather,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('searches').add(newSearch);
        res.status(201).json({ id: docRef.id, ...newSearch });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const snapshot = await db.collection('searches').orderBy('timestamp', 'desc').get();
        const searches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(searches);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
