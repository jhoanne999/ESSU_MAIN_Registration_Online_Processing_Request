// --- Account store (localStorage-based, since there's no backend yet) ---
const ACCOUNTS_KEY = "essu_accounts";

function loadAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (raw) return JSON.parse(raw);

  // Seed default accounts on first run
  const defaults = [
    { studentId: "superadmin", password: "SuperAdmin@123", role: "superadmin", fullName: "Super Admin", email: "" },
    { studentId: "admin", password: "admin123", role: "admin", fullName: "Admin", email: "" },
    { studentId: "student24-12345", password: "studentpass123", role: "student", fullName: "Student", email: "" }
  ];
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
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

form.addEventListener("submit", function (event) {
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

    const accounts = loadAccounts();
    const match = accounts.find(
        (acc) => acc.studentId === username && acc.password === userPassword
    );

    if (!match) {
        shake(studentNumber);
        shake(password);
        showError("Invalid username or password.");
        return;
    }

    // Store who's logged in for this session
    sessionStorage.setItem(
        "essu_currentUser",
        JSON.stringify({ studentId: match.studentId, role: match.role, fullName: match.fullName })
    );

    console.log(`${match.role} login successful.`);

    if (match.role === "superadmin") {
        window.location.href = "superadmin-dashboard.html";
    } else if (match.role === "admin") {
        window.location.href = "admin-dashboard.html";
    } else {
        window.location.href = "student-dashboard.html";
    }
});