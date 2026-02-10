import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { db } from "./firebase.js";

import { getCurrentUser } from "./auth.js";

async function submitScore(seed, time) {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const user = getCurrentUser();
    if (!user) {
      console.warn("No user logged in, score will not be submitted");
      return;
    }

    await addDoc(
      collection(db, "leaderboards", String(seed), "runs"),
      {
        uid: user.uid,
        username: user.displayName || "Anonymous",
        time: time,
        createdAt: serverTimestamp()
      }
    );

    console.log("Score submitted successfully");
  } catch (error) {
    console.error("Error submitting score:", error);
    // TODO: Show error message to user, handle errors gracefully
  }
}

async function loadLeaderboard(seed, limitCount = 10) {
  const q = query(
    collection(db, "leaderboards", seed, "runs"),
    orderBy("time", "asc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc, index) => ({
    rank: index + 1,
    username: doc.data().username,
    time: doc.data().time
  }));
}

export { submitScore, loadLeaderboard };