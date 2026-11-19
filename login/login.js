// ==========================================
// 1. Import Modul Firebase SDK (Versi Modular v10)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

// ==========================================
// 3. Inisialisasi Firebase & Authentication
// ==========================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==========================================
// 5. Fungsi Log Masuk (Use Case Table 4.6b)
// ==========================================
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const alertBox = document.getElementById('alertBox');
    const loginBtn = document.getElementById('loginBtn');

    // Reset kotak mesej amaran
    alertBox.style.display = 'none';
    alertBox.className = 'alert-box';

    // Langkah 1: Semak ruangan input tidak kosong
    if (!email || !password) {
        showAlert('Please enter both email and password.', 'alert-error');
        return;
    }

    loginBtn.textContent = 'Authenticating...';
    loginBtn.disabled = true;

    try {
        // Langkah 2 & 3: Sahkan e-mel dan kata laluan melalui Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Langkah 4: Cipta sesi pengguna dalam pelayar
        sessionStorage.setItem('chillsense_uid', user.uid);
        sessionStorage.setItem('chillsense_email', user.email);

        showAlert('Login successful! Redirecting to dashboard...', 'alert-success');

        // Langkah 5: Arahkan ke Dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        console.error("Firebase Auth Error:", error.code, error.message);

        if (error.code === 'auth/user-not-found') {
            // Exception 1: E-mel tidak berdaftar
            showAlert('Account not found', 'alert-error');
        } else if (error.code === 'auth/wrong-password') {
            // Exception 2: Kata laluan salah
            showAlert('Invalid password', 'alert-error');
        } else if (error.code === 'auth/invalid-credential') {
            // Firebase versi baru pulangkan kod ini untuk e-mel ATAU password salah
            showAlert('Invalid email or password', 'alert-error');
        } else if (error.code === 'auth/too-many-requests') {
            showAlert('Too many attempts. Please try again later.', 'alert-error');
        } else if (error.code === 'auth/network-request-failed') {
            // Exception 3: Rangkaian gagal
            showAlert('Network error, please try again', 'alert-error');
        } else {
            showAlert('Login failed: ' + error.message, 'alert-error');
        }

        loginBtn.textContent = 'Sign In';
        loginBtn.disabled = false;
    }
});

// Fungsi bantuan untuk memaparkan mesej
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.classList.add(type);
    alertBox.style.display = 'block';
}
