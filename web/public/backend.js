// backend.js — Firebase init + Firestore helpers for simplefon.ai
// Works with the current App-account script (uses fields: name, areaCode, plan, paymentMethod, about, minutes, number)
// ESM CDN imports (serve over http:// or https://, not file://)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  doc, getDoc, setDoc,
  collection, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp,
  getDocs, query, orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ---- Firebase config (provided by you)
const firebaseConfig = {
  projectId: 'simplefon',
  appId: '1:737609214127:web:76dcc600e272954f918c5a',
  storageBucket: 'simplefon.firebasestorage.app',
  apiKey: 'AIzaSyCOJJnbYeoXhBXEGzatsp1Y8t-w5iVgYEw',
  authDomain: 'simplefon.firebaseapp.com',
  messagingSenderId: '737609214127',
  measurementId: 'G-GK26SJ0LQH'
};

// ---- Init
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ---- Path helpers
const userDocRef    = (phone)       => doc(db, 'users', String(phone));
const agentsColRef  = (phone)       => collection(db, 'users', String(phone), 'agents');
const agentDocRef   = (phone, id)   => doc(db, 'users', String(phone), 'agents', String(id));

// ---- Account
export async function ensureUser(phone, extra = {}) {
  const ref = userDocRef(phone);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { phone: String(phone), createdAt: serverTimestamp(), updatedAt: serverTimestamp(), ...extra }, { merge: true });
  }
}

export async function readAccount(phone) {
  const ref = userDocRef(phone);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
}

export async function saveAccount(phone, data) {
  const ref = userDocRef(phone);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ---- Agents
export function subscribeAgents(phone, cb) {
  const q = query(agentsColRef(phone), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (qs) => {
    const items = qs.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(items);
  });
}

export async function addAgent(phone, agent) {
  const now = serverTimestamp();
  const payload = {
    name: 'New Agent',
    areaCode: '',
    plan: 'intro',
    paymentMethod: '',
    about: '',
    minutes: 0,
    number: '',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...agent
  };
  const ref = await addDoc(agentsColRef(phone), payload);
  return ref.id;
}

export async function updateAgent(phone, id, patch) {
  await updateDoc(agentDocRef(phone, id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteAgent(phone, id) {
  await deleteDoc(agentDocRef(phone, id));
}

export async function duplicateAgent(phone, id) {
  const src = await getDoc(agentDocRef(phone, id));
  if (!src.exists()) return null;
  const data = src.data();
  // drop timestamps to let server set new ones
  delete data.createdAt; delete data.updatedAt;
  return addAgent(phone, { ...data, name: (data.name || 'Agent') + ' (copy)' });
}

export async function ensureFirstAgentIfNone(phone, defaultAgent = {}) {
  const qs = await getDocs(agentsColRef(phone));
  if (qs.empty) {
    await addAgent(phone, defaultAgent);
    return true;
  }
  return false;
}

// --- Utility (for backward-compat with older app-account.js builds)
export function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}
