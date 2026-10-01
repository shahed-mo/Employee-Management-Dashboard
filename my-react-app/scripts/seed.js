const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require(
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    "C:/Users/Shahed/Downloads/secrets/serviceAccountKey.json"
);
const data = require("../Employee.json");

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();
const db = getFirestore();

// باسورد احتياطي لو الباسورد في الـ JSON ناقص أو أقصر من 6 حروف (Firebase يرفض أقل من 6)
const FALLBACK_PASSWORD = process.env.DEMO_PASSWORD || "Demo12345";
const DUPLICATE_IDS = ["3"]; // نسخ مكررة من David و James

const str = (v) => String(v);

// الأدمن والـ HR نفس الصلاحية: أي "hr" بيتحول "admin"
const normalizeRole = (role) => {
  const r = String(role || "employee").trim().toLowerCase();
  return r === "hr" ? "admin" : r;
};

async function ensureAuthUser(email, name, oldPassword) {
  const old = String(oldPassword || "");
  const password = old.length >= 6 ? old : FALLBACK_PASSWORD;

  try {
    const existing = await auth.getUserByEmail(email);
    await auth.updateUser(existing.uid, { password }); // يحدّث الباسورد للحساب الموجود
    return existing.uid;
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
  }

  const user = await auth.createUser({ email, password, displayName: name });
  return user.uid;
}

// Firestore batch حده 500 عملية، فبنقسمها على دفعات
const ops = [];
const queueSet = (ref, payload) => ops.push({ ref, payload });

async function commitAll() {
  const CHUNK = 400;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const batch = db.batch();
    ops.slice(i, i + CHUNK).forEach(({ ref, payload }) => batch.set(ref, payload));
    await batch.commit();
  }
}

async function main() {
  // employees + users + Auth
  const employees = data.employees.filter((e) => !DUPLICATE_IDS.includes(str(e.id)));
  for (const emp of employees) {
    const { id, password, role, initials, ...rest } = emp; // شيلنا password و role و initials من Firestore
    const email = emp.email.trim().toLowerCase();
    const employeeId = str(id);
    const finalRole = normalizeRole(role);
    const uid = await ensureAuthUser(email, emp.name, password);

    queueSet(db.collection("users").doc(uid), {
      email,
      role: finalRole,
      employeeId,
    });
    queueSet(db.collection("employees").doc(employeeId), {
      ...rest,
      email,
      authUid: uid,
    });
    console.log(`✔ ${email} (${finalRole})`);
  }

  // leaveRequests
  for (const r of data.leaveRequests) {
    const { id, ...rest } = r;
    queueSet(db.collection("leaveRequests").doc(str(id)), {
      ...rest,
      employeeId: str(rest.employeeId),
    });
  }

  // attendance
  for (const a of data.attendance) {
    const { id, ...rest } = a;
    const employeeId = str(rest.employeeId);
    queueSet(db.collection("attendance").doc(`${employeeId}_${rest.date}`), {
      ...rest,
      employeeId,
      status: String(rest.status).toLowerCase() === "absent" ? "Absent" : rest.status,
    });
  }

  // payroll
  for (const p of data.payroll) {
    const { id, ...rest } = p;
    const employeeId = str(rest.employeeId);
    queueSet(db.collection("payroll").doc(`${employeeId}_${rest.month}`), {
      ...rest,
      employeeId,
    });
  }

  // providentFund
  for (const f of data.providentFund) {
    const { id, ...rest } = f;
    const employeeId = str(rest.employeeId);
    queueSet(db.collection("providentFund").doc(`${employeeId}_${rest.month}`), {
      ...rest,
      employeeId,
    });
  }

  await commitAll();
  console.log(`Done ✅ (${ops.length} documents)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});