const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./auditvault-25052-firebase-adminsdk-fbsvc-00003e47b7.json");

initializeApp({
  credential: cert(serviceAccount),
});

const adminAuth = getAuth();

module.exports = adminAuth;