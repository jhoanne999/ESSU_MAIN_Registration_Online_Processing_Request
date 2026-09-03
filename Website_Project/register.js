const form = document.getElementById("registerForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const studentNumber = document.getElementById("studentNumber")?.value;
        const fullName = document.getElementById("fullName")?.value;
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;
        const confirmPassword = document.getElementById("confirmPassword")?.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentNumber, fullName, email, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert("Registration Successful!");
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Failed to submit form.");
        }
    });
}