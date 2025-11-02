import "dotenv/config";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "tM15836Tfjhcwvlx2LXEpVc7Yjy1";

try {
  await admin.auth().setCustomUserClaims(uid, { role: "admin" });
  console.log(`Successfully assigned admin role to user: ${uid}`);
} catch (err) {
  console.error("Error setting admin role:", err);
} finally {
  process.exit(0);
}