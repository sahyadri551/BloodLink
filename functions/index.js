const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();


exports.onDonationCreated = functions.firestore
    .document("donations/{donationId}")
    .onCreate(async (snap, context) => {
      const donation = snap.data();
      const donorId = donation.donorId;

      if (!donorId) {
        console.error("Donation document is missing a donorId.");
        return null;
      }

      const userDocRef = db.collection("users").doc(donorId);

      try {
        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
          console.error(`User document ${donorId} not found.`);
          return null;
        }

        const userData = userDoc.data();

        const newCount = (userData.donationCount || 0) + 1;
        const currentBadges = userData.badges || [];

        if (newCount === 1 && !currentBadges.includes("First Time Hero")) {
          currentBadges.push("First Time Hero");
        }
        if (newCount === 3 && !currentBadges.includes("Bronze Donor")) {
          currentBadges.push("Bronze Donor");
        }
        if (newCount === 10 && !currentBadges.includes("Silver Donor")) {
          currentBadges.push("Silver Donor");
        }
        return userDocRef.update({
          donationCount: admin.firestore.FieldValue.increment(1),
          badges: currentBadges,
        });
      } catch (error) {
        console.error("Error updating user for badges: ", error);
        return null;
      }
    });
