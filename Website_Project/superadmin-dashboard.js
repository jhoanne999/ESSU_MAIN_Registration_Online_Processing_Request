const ACCOUNTS_KEY = "essu_accounts";

// --- Auth guard: only superadmin gets in ---
const currentUserRaw = sessionStorage.getItem("essu_currentUser");
const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

if (!currentUser || currentUser.role !== "superadmin") {
    window.location.href = "index.html";
}

document.getElementById("welcomeText").textContent = currentUser
    ? `Welcome, ${currentUser.fullName || currentUser.studentId}`
    : "";

document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("essu_currentUser");
    window.location.href = "index.html";
});

// --- Account helpers ---
function loadAccounts() {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function renderAccounts() {
    const accounts = loadAccounts();
    const tbody = document.getElementById("accountsTableBody");
    tbody.innerHTML = "";

    accounts.forEach((acc) => {
        const row = document.createElement("tr");
        row.className = "border-b border-white/10";
        row.innerHTML = `
          <td class="py-2 px-2">${acc.studentId}</td>
          <td class="py-2 px-2">${acc.fullName || ""}</td>
          <td class="py-2 px-2">${acc.email || ""}</td>
          <td class="py-2 px-2 capitalize">${acc.role}</td>
          <td class="py-2 px-2 text-right">
            <button data-id="${acc.studentId}" class="deleteBtn text-red-300 hover:text-red-500 font-semibold">
              Delete
            </button>
          </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            if (id === currentUser.studentId) {
                alert("You can't delete the account you're currently logged in as.");
                return;
            }
            const updated = loadAccounts().filter((a) => a.studentId !== id);
            saveAccounts(updated);
            renderAccounts();
        });
    });
}

renderAccounts();

// --- Add account form ---
const addForm = document.getElementById("addAccountForm");
const addErrorMsg = document.getElementById("addErrorMsg");
const addSuccessMsg = document.getElementById("addSuccessMsg");

function showAddError(message) {
    addSuccessMsg.style.opacity = "0";
    addErrorMsg.textContent = message;
    addErrorMsg.style.opacity = "1";
}

function showAddSuccess(message) {
    addErrorMsg.style.opacity = "0";
    addSuccessMsg.textContent = message;
    addSuccessMsg.style.opacity = "1";
}

addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const studentId = document.getElementById("newStudentId").value.trim();
    const fullName = document.getElementById("newFullName").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const role = document.getElementById("newRole").value;
    const pw = document.getElementById("newPassword").value;
    const confirmPw = document.getElementById("newConfirmPassword").value;

    const idRegex = /^[A-Za-z0-9_-]+$/;

    if (!studentId || !idRegex.test(studentId)) {
        showAddError("Enter a valid ID (letters, numbers, _ and - only).");
        return;
    }

    if (!fullName) {
        showAddError("Full name is required.");
        return;
    }

    if (pw.length < 8 || pw.length > 32) {
        showAddError("Password must be 8–32 characters.");
        return;
    }

    if (pw !== confirmPw) {
        showAddError("Passwords do not match.");
        return;
    }

    const accounts = loadAccounts();

    if (accounts.some((a) => a.studentId === studentId)) {
        showAddError("An account with that ID already exists.");
        return;
    }

    accounts.push({ studentId, password: pw, role, fullName, email });
    saveAccounts(accounts);

    showAddSuccess(`Account "${studentId}" (${role}) added successfully.`);
    addForm.reset();
    renderAccounts();
});