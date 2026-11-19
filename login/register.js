// ==========================================
// 1. Import Modul Firebase SDK (Auth & Realtime Database)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ==========================================
// 2. Konfigurasi Firebase Projek ChillSense Anda
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
// 3. Inisialisasi Firebase Auth & Realtime Database
// ==========================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ==========================================
// 4. Fungsi Pendaftaran Akaun (Use Case Register)
// ==========================================
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const storeName = document.getElementById('storeName').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    const alertBox = document.getElementById('alertBox');
    const registerBtn = document.getElementById('registerBtn');

    alertBox.style.display = 'none';
    alertBox.className = 'alert-box';

    if (!storeName || !fullName || !email || !password || !confirmPassword) {
        showAlert('Please fill in all required fields.', 'alert-error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'alert-error');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long.', 'alert-error');
        return;
    }

    registerBtn.textContent = 'Creating Account...';
    registerBtn.disabled = true;

    try {
        // Langkah 1: Cipta akaun pengguna baharu dalam Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Auth berjaya dicipta, UID:", user.uid);

        // Langkah 2: Cuba simpan profil ke Realtime Database (dengan timeout 5 saat supaya tak sangkut)
        try {
            const dbPromise = set(ref(db, 'Users/' + user.uid), {
                user_id: user.uid,
                storeName: storeName,
                fullName: fullName,
                email: email,
                role: "OWNER",
                createdAt: new Date().toISOString()
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Database timeout - semak Database Rules atau URL")), 5000)
            );

            await Promise.race([dbPromise, timeoutPromise]);
            console.log("Profil berjaya disimpan ke Realtime Database");
        } catch (dbError) {
            console.warn("Akaun Auth berjaya, tetapi gagal simpan ke Realtime Database:", dbError.message);
        }

        // Langkah 3: Papar mesej berjaya dan arahkan ke halaman Login
        showAlert('Account created successfully! Redirecting to login page...', 'alert-success');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error("Registration Error:", error.code, error.message);

        if (error.code === 'auth/email-already-in-use') {
            showAlert('Email already exists. Please sign in instead.', 'alert-error');
        } else if (error.code === 'auth/invalid-email') {
            showAlert('Invalid email address format.', 'alert-error');
        } else if (error.code === 'auth/operation-not-allowed') {
            showAlert('Sila aktifkan Email/Password di Firebase Console > Authentication > Sign-in method!', 'alert-error');
        } else if (error.code === 'auth/network-request-failed') {
            showAlert('Network error, please try again.', 'alert-error');
        } else {
            showAlert('Registration failed: ' + error.message, 'alert-error');
        }

        registerBtn.textContent = 'Register Account';
        registerBtn.disabled = false;
    }
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.classList.add(type);
    alertBox.style.display = 'block';
}