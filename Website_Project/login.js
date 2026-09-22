import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// --- Legacy hardcoded accounts (admin / superadmin only, until those are migrated to Firebase) ---
const ACCOUNTS_KEY = "essu_accounts";

function loadAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (raw) return JSON.parse(raw);

  const defaults = [
    { studentId: "superadmin", password: "SuperAdmin@123", role: "superadmin", fullName: "Super Admin", email: "" },
    { studentId: "admin", password: "admin123", role: "admin", fullName: "Admin", email: "" }
  ];
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(defaults));
  return defaults;
}

// --- Login form logic ---
const form = document.getElementById("loginForm");
const studentNumber = document.getElementById("studentNumber");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

loginBtn.addEventListener("mouseenter", () => {
    loginBtn.style.transform = "translateY(-2px)";
    loginBtn.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
});

loginBtn.addEventListener("mouseleave", () => {
    loginBtn.style.transform = "translateY(0)";
    loginBtn.style.boxShadow = "none";
});

loginBtn.addEventListener("mousedown", () => {
    loginBtn.style.transform = "scale(0.95)";
});

loginBtn.addEventListener("mouseup", () => {
    loginBtn.style.transform = "translateY(-2px)";
});

function shake(element) {
    element.style.transform = "translateX(-6px)";
    setTimeout(() => { element.style.transform = "translateX(6px)"; }, 50);
    setTimeout(() => { element.style.transform = "translateX(-6px)"; }, 100);
    setTimeout(() => { element.style.transform = "translateX(6px)"; }, 150);
    setTimeout(() => { element.style.transform = "translateX(0)"; }, 200);
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.opacity = "1";
}

function hideError() {
    errorMsg.style.opacity = "0";
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideError();

    const username = studentNumber.value.trim();
    const userPassword = password.value.trim();

    if (username === "") {
        shake(studentNumber);
        showError("Student number is required.");
        return;
    }

    if (username.length > 32) {
        shake(studentNumber);
        showError("Student number must not exceed 32 characters.");
        return;
    }

    const usernameRegex = /^[A-Za-z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        shake(studentNumber);
        showError("Student number can only contain letters, numbers, _ and -.");
        return;
    }

    if (userPassword === "") {
        shake(password);
        showError("Password is required.");
        return;
    }

    if (userPassword.length < 8) {
        shake(password);
        showError("Password must be at least 8 characters.");
        return;
    }

    if (userPassword.length > 32) {
        shake(password);
        showError("Password must not exceed 32 characters.");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
        // 1. Check legacy hardcoded admin / superadmin accounts first
        const accounts = loadAccounts();
        const localMatch = accounts.find(
            (acc) => acc.studentId === username && acc.password === userPassword
        );

        if (localMatch) {
            sessionStorage.setItem(
                "essu_currentUser",
                JSON.stringify({ studentId: localMatch.studentId, role: localMatch.role, fullName: localMatch.fullName })
            );

            if (localMatch.role === "superadmin") {
                window.location.href = "superadmin-dashboard.html";
            } else {
                window.location.href = "admin-dashboard.html";
            }
            return;
        }

        // 2. Otherwise, look up the student's email in Firestore by their Student ID
        const studentsRef = collection(db, "students");
        const q = query(studentsRef, where("studentNumber", "==", username));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            shake(studentNumber);
            shake(password);
            showError("Invalid username or password.");
            return;
        }

        const studentDoc = snapshot.docs[0].data();

        // 3. Sign in with Firebase Auth using that email + the entered password
        const userCredential = await signInWithEmailAndPassword(auth, studentDoc.email, userPassword);
        const user = userCredential.user;

        sessionStorage.setItem(
            "essu_currentUser",
            JSON.stringify({ uid: user.uid, studentId: studentDoc.studentNumber, role: "student", fullName: studentDoc.fullName })
        );

        window.location.href = "student-dashboard.html";

    } catch (error) {
        console.error("Login error:", error);

        switch (error.code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                shake(studentNumber);
                shake(password);
                showError("Invalid username or password.");
                break;
            default:
                showError("Failed to log in. Please try again.");
        }

    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
});