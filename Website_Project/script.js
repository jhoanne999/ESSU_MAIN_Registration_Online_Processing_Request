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

    setTimeout(() => {
        element.style.transform = "translateX(6px)";
    }, 50);

    setTimeout(() => {
        element.style.transform = "translateX(-6px)";
    }, 100);

    setTimeout(() => {
        element.style.transform = "translateX(6px)";
    }, 150);

    setTimeout(() => {
        element.style.transform = "translateX(0)";
    }, 200);
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
        showError(
            "Student number can only contain letters, numbers, _ and -."
        );
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

    if (username === "admin" && userPassword === "admin123") {
        console.log("Admin login successful.");

        window.location.href = "admin-dashboard.html";
        return;
    }

    if (
        username === "student24-12345" &&
        userPassword === "studentpass123"
    ) {
        console.log("Student login successful.");

        window.location.href = "student-dashboard.html";
        return;
    }

    shake(studentNumber);
    shake(password);

    showError("Invalid username or password.");
});

