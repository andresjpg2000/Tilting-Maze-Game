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

async function loadLeaderboard(seed) {
  const user = getCurrentUser();

  // Top 10
  const topQuery = query(
    collection(db, "leaderboards", String(seed), "runs"),
    orderBy("time", "asc"),
    limit(10)
  );

  const topSnap = await getDocs(topQuery);

  const top = topSnap.docs.map((doc, index) => ({
    rank: index + 1,
    uid: doc.data().uid,
    username: doc.data().username,
    time: doc.data().time
  }));

  if (!user) return top;

  // If user already in top 10, done
  if (top.some(e => e.uid === user.uid)) {
    return top;
  }

  // Count how many runs are faster than the user's best
  const userRunsQuery = query(
    collection(db, "leaderboards", String(seed), "runs"),
    where("uid", "==", user.uid),
    orderBy("time", "asc"),
    limit(1)
  );

  const userRunsSnap = await getDocs(userRunsQuery);
  if (userRunsSnap.empty) return top;

  const userBestTime = userRunsSnap.docs[0].data().time;

  const rankQuery = query(
    collection(db, "leaderboards", String(seed), "runs"),
    where("time", "<", userBestTime)
  );

  const rankSnap = await getDocs(rankQuery);
  const userRank = rankSnap.size + 1;

  top.push({
    rank: userRank,
    uid: user.uid,
    username: user.displayName || "You",
    time: userBestTime,
    isMe: true
  });

  return top;
}

export { submitScore, loadLeaderboard };