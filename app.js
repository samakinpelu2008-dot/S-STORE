import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsp1dhU-doTWk66hPyQA8W-GauzYrgDZs",
  authDomain: "fir-store-8a665.firebaseapp.com",
  projectId: "fir-store-8a665",
  storageBucket: "fir-store-8a665.firebasestorage.app",
  messagingSenderId: "504536994648",
  appId: "1:504536994648:web:19c5dbe539a2e62c164b2d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

window.uploadApp = async function () {

  const name = document.getElementById("appName").value;
  const desc = document.getElementById("appDesc").value;
  const version = document.getElementById("appVersion").value;
  const file = document.getElementById("appFile").files[0];

  if (!file) {
    alert("Select APK file");
    return;
  }

  const storageRef = ref(storage, "apps/" + file.name);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, "apps"), {
    name: name,
    description: desc,
    version: version,
    downloadURL: downloadURL
  });

  alert("App Uploaded Successfully 🔥");
  location.reload();
};

async function loadApps() {
  const querySnapshot = await getDocs(collection(db, "apps"));
  const appList = document.getElementById("appList");

  querySnapshot.forEach((doc) => {
    const app = doc.data();

    const div = document.createElement("div");
    div.className = "app-card";

    div.innerHTML = `
      <h3>${app.name}</h3>
      <p>${app.description}</p>
      <p>Version: ${app.version}</p>
      <a href="${app.downloadURL}" target="_blank">
        <button>Download</button>
      </a>
    `;

    appList.appendChild(div);
  });
}

loadApps();
