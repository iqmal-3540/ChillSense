// ==========================================
// 1. Import Modul Firebase SDK
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ==========================================
// 2. Konfigurasi Firebase Projek ChillSense
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDAQOhkSScedIbK1CD3lUA2CdcCgCKXKho",
    authDomain: "chillsense-47c86.firebaseapp.com",
    databaseURL: "https://chillsense-47c86-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chillsense-47c86",
    storageBucket: "chillsense-47c86.firebasestorage.app",
    messagingSenderId: "864056037660",
    appId: "1:864056037660:web:14d87d5cf5690bf0f2aad9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==========================================
// 3. Hantar E-mel Reset Kata Laluan
// ==========================================
document.getElementById('resetForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const alertBox = document.getElementById('alertBox');
    const resetBtn = document.getElementById('resetBtn');

    alertBox.style.display = 'none';
    alertBox.className = 'alert-box';

    if (!email) {
        showAlert('Please enter your email address.', 'alert-error');
        return;
    }

    resetBtn.textContent = 'Sending...';
    resetBtn.disabled = true;

    try {
        await sendPasswordResetEmail(auth, email);
        showAlert('If this email is registered, a reset link has been sent. Please check your inbox (and spam folder).', 'alert-success');
    } catch (error) {
        console.error("Reset Password Error:", error.code, error.message);

        if (error.code === 'auth/invalid-email') {
            showAlert('Invalid email address format.', 'alert-error');
        } else if (error.code === 'auth/user-not-found') {
            // Mesej sama seperti berjaya supaya tidak dedahkan e-mel mana yang berdaftar
            showAlert('If this email is registered, a reset link has been sent. Please check your inbox (and spam folder).', 'alert-success');
        } else if (error.code === 'auth/too-many-requests') {
            showAlert('Too many attempts. Please try again later.', 'alert-error');
        } else if (error.code === 'auth/network-request-failed') {
            showAlert('Network error, please try again.', 'alert-error');
        } else {
            showAlert('Failed to send reset link: ' + error.message, 'alert-error');
        }
    }

    resetBtn.textContent = 'Send Reset Link';
    resetBtn.disabled = false;
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.classList.add(type);
    alertBox.style.display = 'block';
}
