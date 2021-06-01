function checkForIndexedDb() {
  if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB.");
    return false;
  }
  return true;
}
const request = window.indexedDB.open("budgetTracker", 1);
let db, tx, store;

request.onupgradeneeded = function (e) {
  const db = request.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = function (e) {
  console.log("There was an error");
};

request.onsuccess = function (e) {
  db = request.result;
  if (navigator.online) {
    checkdatabase();
  }
  db.onerror = function (e) {
    console.log("error");
  };
};
function saveRecord(record) {
  tx = db.transaction(["pending"], "readwrite");
  store = tx.objectStore("pending");
  store.add(record);
}
function checkdatabase() {
  tx = db.transaction(["pending"], "readwrite");
  store = tx.objectStore("pending");

  const all = store.getAll();
  all.onsuccess = function () {
    if (all.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "post",
        body: JSON.stringify(all.result),
        headers: {
          Accept: "application/JSON",
          "content-type": "application/JSON",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          tx = db.transaction(["pending"], "readwrite");
          store = tx.objectStore("pending");
          store.clear();
        });
    }
  };
}

window.addEventListener("online",checkdatabase);
