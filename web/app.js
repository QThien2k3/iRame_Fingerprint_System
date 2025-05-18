// DOM elements cho fingerprint
const fingerStatusEl = document.getElementById('fingerStatus');
const manageSection = document.getElementById('manageSection');
const historySection = document.getElementById('historySection');
const btnManage = document.getElementById('btnManage');
const btnHistory = document.getElementById('btnHistory');
const editModal = document.getElementById('editModal');

btnManage.onclick = () => {
  manageSection.classList.add('active');
  historySection.classList.remove('active');
};
btnHistory.onclick = () => {
  historySection.classList.add('active');
  manageSection.classList.remove('active');
};

function openEditModal(id) {
  // Lấy dữ liệu user theo id và điền vào form
  document.getElementById('editId').value = id;
  // ...
  editModal.style.display = 'flex';
}
function closeEditModal() {
  editModal.style.display = 'none';
}
function saveUser() {
  alert('Đã lưu thông tin người dùng (giả lập)');
  closeEditModal();
}
function deleteUser(id) {
  alert('Xóa user ID ' + id + ' (giả lập)');
}
function syncUser(id) {
  alert('Sync user ID ' + id + ' (giả lập)');
}

// Polling E-Ra Platform (V0)
const ERA_TOKEN = 'YOUR_ERA_TOKEN';
setInterval(() => {
  fetch(`https://blynk.cloud/external/api/get?token=${ERA_TOKEN}&V0`)
    .then(r => r.text())
    .then(name => { if(name) fingerStatusEl.textContent = name; });
}, 2000);
