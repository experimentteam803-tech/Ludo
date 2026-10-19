import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const recordVerifiedAd = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = context.auth.uid;
  const userClaimRef = db.collection('free_game_claims').doc(uid);

  return await db.runTransaction(async (transaction) => {
    const claimDoc = await transaction.get(userClaimRef);
    const now = Date.now();
    const claimData = claimDoc.exists ? claimDoc.data() : { adsWatched: 0, cooldownExpiresAt: 0 };

    if (claimData?.cooldownExpiresAt && claimData.cooldownExpiresAt > now) {
      throw new functions.https.HttpsError('failed-precondition', 'Cooldown active.');
    }

    const nextAdsWatched = (claimData?.adsWatched || 0) + 1;
    let unlocked = false;
    let cooldown = claimData?.cooldownExpiresAt || 0;

    if (nextAdsWatched >= 2) {
      unlocked = true;
      cooldown = now + 60 * 60 * 1000; // 60 minutes
    }

    transaction.set(userClaimRef, {
      adsWatched: unlocked ? 0 : nextAdsWatched,
      unlockedSession: unlocked,
      cooldownExpiresAt: cooldown,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true, unlocked, adsWatched: unlocked ? 0 : nextAdsWatched };
  });
});
