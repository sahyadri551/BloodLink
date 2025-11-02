import "dotenv/config";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "RwW0RS98oNZLwpj3nj3OxVVE2pz2";

try {
  await admin.auth().setCustomUserClaims(uid, {});

  console.log(` Admin role revoked successfully for user: ${uid}`);

  const user = await admin.auth().getUser(uid);
  console.log(`User email: ${user.email}`);
  console.log(" The user will lose admin privileges after their next sign-in.");
} catch (err) {
  console.error(" Error revoking admin role:", err);
} finally {
  process.exit(0);
}
