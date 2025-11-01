const admin = require("firebase-admin");
const fs = require("node:fs");

dotenv.config(); 

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "YOUR_ADMIN_UID_HERE";

try {
  await admin.auth().setCustomUserClaims(uid, { role: "admin" });
  console.log(`Successfully assigned admin role to user: ${uid}`);
} catch (err) {
  console.error("Error setting admin role:", err);
  process.exit(1);
}