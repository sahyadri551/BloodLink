const admin = require("firebase-admin");
const fs = require("node:fs");

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"))
  ),
});

const uid = "YOUR_ADMIN_USER_UID";

try {
  await admin.auth().setCustomUserClaims(uid, { role: "admin" });
  console.log(`Successfully assigned admin role to user: ${uid}`);
} catch (err) {
  console.error("Error setting admin role:", err);
  process.exit(1);
}

process.exit(0);