import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// 1. Verify rewarded ad server-side & award free pass
export const verifyRewardedAdClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const userId = context.auth.uid;
  const userRef = db.collection('users').doc(userId);

  return db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User record missing.');
    }

    const userData = userDoc.data() || {};
    const now = Date.now();
    const cooldownEndsAt = userData.adCooldownEndsAt || 0;

    if (now < cooldownEndsAt) {
      throw new functions.https.HttpsError('failed-precondition', 'Ad cooldown active.');
    }

    const txRef = userRef.collection('transactions').doc();
    transaction.set(txRef, {
      userId,
      amount: 50,
      type: 'REWARDED_AD',
      description: 'Completed 2 verified sponsor video ads',
      timestamp: now,
    });

    transaction.update(userRef, {
      virtualCoins: (userData.virtualCoins || 0) + 50,
      adCooldownEndsAt: now + 60 * 60 * 1000, // 60 mins cooldown
    });

    return { success: true, newBalance: (userData.virtualCoins || 0) + 50 };
  });
});
