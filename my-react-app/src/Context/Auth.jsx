import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, collection, writeBatch } from "firebase/firestore";
import { auth, db } from "../../firebase"; // عدّل المسار حسب مكان الملف

export const AutContext = createContext();

// رسائل خطأ مفهومة
const authMessage = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Invalid email or password";
    case "auth/email-already-in-use":
      return "Email already exists";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    case "auth/too-many-requests":
      return "Too many attempts, try again later";
    case "auth/network-request-failed":
      return "Network error";
    default:
      return "Server error";
  }
};

// يجيب الـ role من users/{uid} وبيانات الموظف من employees/{employeeId}
async function loadProfile(firebaseUser) {
  const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
  if (!userSnap.exists()) return null;

  const { role, employeeId } = userSnap.data();
  const empSnap = await getDoc(doc(db, "employees", String(employeeId)));
  const emp = empSnap.exists() ? empSnap.data() : {};

  return {
    ...emp,
    id: String(employeeId),
    employeeId: String(employeeId),
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role,
  };
}

export const Authprovider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const registering = useRef(false); // يمنع السباق أثناء التسجيل

  // 🔄 الجلسة بتفضل بعد الريفريش عن طريق Firebase نفسه
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (registering.current) return; // register هو اللي هيظبط الـ User
      try {
        if (!fbUser) {
          setUser(null);
        } else {
          const profile = await loadProfile(fbUser);
          if (profile) {
            setUser(profile);
          } else {
            await signOut(auth);
            setUser(null);
          }
        }
      } catch (e) {
        console.error(e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  // 📝 Register (دايمًا role = employee)
  const register = async (userInput) => {
    const { password, role, id, ...rest } = userInput; // نتجاهل أي role جاي من الفورم
    const email = userInput.email.trim().toLowerCase();
    registering.current = true;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const employeeId = doc(collection(db, "employees")).id;

      const batch = writeBatch(db);
      batch.set(doc(db, "users", uid), { email, role: "employee", employeeId });
      batch.set(doc(db, "employees", employeeId), { ...rest, email, authUid: uid });
      await batch.commit();

      const profile = await loadProfile(cred.user);
      setUser(profile);
      return { success: true, user: profile };
    } catch (error) {
      console.error(error);
      return { success: false, message: authMessage(error.code) };
    } finally {
      registering.current = false;
      setLoading(false);
    }
  };

  // 🔐 Login
  const login = async ({ email, password }) => {
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password.trim()
      );
      const profile = await loadProfile(cred.user);
      if (!profile) {
        await signOut(auth);
        return { success: false, message: "Account has no profile" };
      }
      setUser(profile);
      return { success: true, user: profile };
    } catch (error) {
      console.error(error);
      return { success: false, message: authMessage(error.code) };
    }
  };

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AutContext.Provider value={{ User, loading, register, login, logout }}>
      {children}
    </AutContext.Provider>
  );
};

export const Auth = () => useContext(AutContext);