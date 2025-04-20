const admin = require('firebase-admin');

// Service account key file from the Firebase console stored locally
const serviceAccount = require('../../biterate-firebase-adminsdk-fbsvc-adfd99ec03.json');

// Initialize Firebase Admin if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;