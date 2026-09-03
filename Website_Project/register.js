const form = document.getElementById("registerForm");

const studentNumber = document.getElementById("studentNumber");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const registerBtn = document.getElementById("registerBtn");
const errorMsg = document.getElementById("errorMsg");

if (registerBtn) {
registerBtn.addEventListener("mouseenter", () => {
registerBtn.style.transform = "translateY(-2px)";
registerBtn.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
});

registerBtn.addEventListener("mouseleave", () => {
    registerBtn.style.transform = "translateY(0)";
    registerBtn.style.boxShadow = "none";
});

registerBtn.addEventListener("mousedown", () => {
    registerBtn.style.transform = "scale(0.95)";
});

registerBtn.addEventListener("mouseup", () => {
    registerBtn.style.transform = "translateY(-2px)";
});
}

function shake(element) {
if (!element) return;

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
if (!errorMsg) return;
errorMsg.textContent = message;
errorMsg.style.opacity = "1";
}

function hideError() {
if (!errorMsg) return;
errorMsg.textContent = "";
errorMsg.style.opacity = "0";
}

if (form) {
form.addEventListener("submit", async (event) => {
event.preventDefault();
    
    hideError();

    const studentID = studentNumber.value.trim();
    const name = fullName.value.trim();
    const userEmail = email.value.trim();
    const userPassword = password.value;
    const confirmPass = confirmPassword.value;

    if (studentID === "") {
        shake(studentNumber);
        showError("Student ID is required.");
        return;
    }

    if (studentID.length > 32) {
        shake(studentNumber);
        showError("Student ID must not exceed 32 characters.");
        return;
    }

    const studentIDRegex = /^[A-Za-z0-9_-]+$/;

    if (!studentIDRegex.test(studentID)) {
        shake(studentNumber);
        showError(
            "Student ID can only contain letters, numbers, _ and -."
        );
        return;
    }

    if (name === "") {
        shake(fullName);
        showError("Full name is required.");
        return;
    }

    if (name.length > 100) {
        shake(fullName);
        showError("Full name must not exceed 100 characters.");
        return;
    }

    if (userEmail === "") {
        shake(email);
        showError("Email is required.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userEmail)) {
        shake(email);
        showError("Please enter a valid email address.");
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

    if (confirmPass === "") {
        shake(confirmPassword);
        showError("Please confirm your password.");
        return;
    }

    if (userPassword !== confirmPass) {
        shake(password);
        shake(confirmPassword);
        showError("Passwords do not match.");
        return;
    }

    try {
        registerBtn.disabled = true;
        registerBtn.textContent = "Registering...";

        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentNumber: studentID,
                fullName: name,
                email: userEmail,
                password: userPassword
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration Successful!");
            window.location.href = "index.html";
        } else {
            showError(result.error || "Registration failed.");
        }

    } catch (error) {
        console.error("Submission Error:", error);
        showError("Failed to connect to the server.");

    } finally {
        registerBtn.disabled = false;
        registerBtn.textContent = "Register";
    }
});
}
