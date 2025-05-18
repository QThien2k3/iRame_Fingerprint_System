document.addEventListener('DOMContentLoaded', function() {
    // Panel navigation
    const homeBtn = document.getElementById('home-btn');
    const manageBtn = document.getElementById('manage-btn');
    const historyBtn = document.getElementById('history-btn');
    
    const homePanel = document.getElementById('home-panel');
    const managePanel = document.getElementById('manage-panel');
    const historyPanel = document.getElementById('history-panel');
    
    homeBtn.addEventListener('click', function() {
        setActivePanel(homePanel, homeBtn);
    });
    
    manageBtn.addEventListener('click', function() {
        setActivePanel(managePanel, manageBtn);
    });
    
    historyBtn.addEventListener('click', function() {
        setActivePanel(historyPanel, historyBtn);
        loadHistoryData();
    });
    
    function setActivePanel(panel, button) {
        // Remove active class from all panels and buttons
        [homePanel, managePanel, historyPanel].forEach(p => p.classList.remove('active'));
        [homeBtn, manageBtn, historyBtn].forEach(b => b.classList.remove('active'));
        
        // Add active class to selected panel and button
        panel.classList.add('active');
        button.classList.add('active');
    }
    
    // Initialize chart
    const ctx = document.getElementById('access-chart').getContext('2d');
    const accessChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
            datasets: [{
                label: 'Access Granted',
                data: [8, 12, 15, 10, 14, 18, 20, 7],
                backgroundColor: 'rgba(52, 168, 83, 0.2)',
                borderColor: 'rgba(52, 168, 83, 1)',
                borderWidth: 2
            }, {
                label: 'Access Denied',
                data: [1, 2, 3, 2, 1, 4, 2, 1],
                backgroundColor: 'rgba(234, 67, 53, 0.2)',
                borderColor: 'rgba(234, 67, 53, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Sample fingerprint data
    let fingerprints = [
        { id: "1", name: "Nguyễn Văn A", access: "full" },
        { id: "2", name: "Trần Thị B", access: "limited" },
        { id: "3", name: "Lê Văn C", access: "guest" }
    ];
    
    // Sample history data
    let scanHistory = [
        { id: 1, fingerId: "1", name: "Nguyễn Văn A", timestamp: "2023-08-10 08:30:15" },
        { id: 2, fingerId: "2", name: "Trần Thị B", timestamp: "2023-08-10 09:45:22" },
        { id: 3, fingerId: "3", name: "Lê Văn C", timestamp: "2023-08-10 12:15:05" },
        { id: 4, fingerId: "1", name: "Nguyễn Văn A", timestamp: "2023-08-11 08:25:42" },
        { id: 5, fingerId: "2", name: "Trần Thị B", timestamp: "2023-08-11 14:33:10" }
    ];
    
    // Update stats
    document.getElementById('total-fingerprints').textContent = fingerprints.length;
    document.getElementById('today-scans').textContent = '4';
    document.getElementById('today-denied').textContent = '1';
    
    // Populate fingerprints table
    function renderFingerprintsTable() {
        const fingerprintsTable = document.getElementById('fingerprints-list');
        fingerprintsTable.innerHTML = '';
        
        fingerprints.forEach(fingerprint => {
            const row = document.createElement('tr');
            
            const idCell = document.createElement('td');
            idCell.textContent = fingerprint.id;
            row.appendChild(idCell);
            
            const nameCell = document.createElement('td');
            nameCell.textContent = fingerprint.name;
            row.appendChild(nameCell);
            
            const accessCell = document.createElement('td');
            let accessText = '';
            switch(fingerprint.access) {
                case 'full': accessText = 'Toàn quyền'; break;
                case 'limited': accessText = 'Hạn chế'; break;
                case 'guest': accessText = 'Khách'; break;
            }
            accessCell.textContent = accessText;
            row.appendChild(accessCell);
            
            const actionCell = document.createElement('td');
            
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit-btn';
            editBtn.textContent = 'Sửa';
            editBtn.addEventListener('click', () => editFingerprint(fingerprint));
            actionCell.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.textContent = 'Xóa';
            deleteBtn.addEventListener('click', () => deleteFingerprint(fingerprint.id));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            
            fingerprintsTable.appendChild(row);
        });
    }
    
    // Fingerprint enrollment simulation
    let enrolling = false;
    const startEnrollBtn = document.getElementById('start-enroll');
    const cancelEnrollBtn = document.getElementById('cancel-enroll');
    const scannerMsg = document.getElementById('scanner-msg');
    const scanProgress = document.getElementById('scan-progress');
    const fingerprintScanner = document.querySelector('.fingerprint-scanner');
    
    startEnrollBtn.addEventListener('click', function() {
        if (!document.getElementById('finger-name').value) {
            alert('Vui lòng nhập tên người dùng trước khi đăng ký vân tay');
            return;
        }
        
        startEnrollment();
    });
    
    cancelEnrollBtn.addEventListener('click', function() {
        cancelEnrollment();
    });
    
    function startEnrollment() {
        enrolling = true;
        startEnrollBtn.disabled = true;
        cancelEnrollBtn.disabled = false;
        
        // Set next available ID
        const nextId = (fingerprints.length + 1).toString();
        document.getElementById('finger-id').value = nextId;
        
        fingerprintScanner.classList.add('enrolling');
        scannerMsg.textContent = 'Đặt ngón tay lên cảm biến... (lần 1/3)';
        scanProgress.style.width = '0%';
        
        // Simulate enrollment steps
        simulateEnrollmentSteps();
    }
    
    function cancelEnrollment() {
        enrolling = false;
        startEnrollBtn.disabled = false;
        cancelEnrollBtn.disabled = true;
        
        fingerprintScanner.classList.remove('enrolling');
        scannerMsg.textContent = 'Đặt ngón tay lên cảm biến để đăng ký vân tay mới';
        scanProgress.style.width = '0%';
        
        document.getElementById('finger-id').value = '';
    }
    
    function simulateEnrollmentSteps() {
        if (!enrolling) return;
        
        // First scan
        setTimeout(() => {
            if (!enrolling) return;
            scanProgress.style.width = '33%';
            scannerMsg.textContent = 'Đang xử lý... Vui lòng chờ';
            
            setTimeout(() => {
                if (!enrolling) return;
                scannerMsg.textContent = 'Đặt ngón tay lên cảm biến... (lần 2/3)';
                
                // Second scan
                setTimeout(() => {
                    if (!enrolling) return;
                    scanProgress.style.width = '66%';
                    scannerMsg.textContent = 'Đang xử lý... Vui lòng chờ';
                    
                    setTimeout(() => {
                        if (!enrolling) return;
                        scannerMsg.textContent = 'Đặt ngón tay lên cảm biến... (lần 3/3)';
                        
                        // Third scan
                        setTimeout(() => {
                            if (!enrolling) return;
                            scanProgress.style.width = '100%';
                            scannerMsg.textContent = 'Đang xử lý và lưu vân tay...';
                            
                            // Complete enrollment
                            setTimeout(() => {
                                if (!enrolling) return;
                                completeEnrollment();
                            }, 1500);
                        }, 2000);
                    }, 1500);
                }, 2000);
            }, 1500);
        }, 2000);
    }
    
    function completeEnrollment() {
        // Add new fingerprint
        const fingerId = document.getElementById('finger-id').value;
        const fingerName = document.getElementById('finger-name').value;
        const fingerAccess = document.getElementById('finger-access').value;
        
        fingerprints.push({
            id: fingerId,
            name: fingerName,
            access: fingerAccess
        });
        
        // Update UI
        renderFingerprintsTable();
        document.getElementById('total-fingerprints').textContent = fingerprints.length;
        
        // Reset enrollment state
        scannerMsg.textContent = 'Vân tay đã được đăng ký thành công!';
        
        // Reset form and buttons after a delay
        setTimeout(() => {
            enrolling = false;
            startEnrollBtn.disabled = false;
            cancelEnrollBtn.disabled = true;
            
            fingerprintScanner.classList.remove('enrolling');
            scannerMsg.textContent = 'Đặt ngón tay lên cảm biến để đăng ký vân tay mới';
            scanProgress.style.width = '0%';
            
            document.getElementById('finger-id').value = '';
            document.getElementById('finger-name').value = '';
            document.getElementById('finger-access').value = 'full';
        }, 3000);
    }
    
    // Edit fingerprint
    function editFingerprint(fingerprint) {
        document.getElementById('finger-id').value = fingerprint.id;
        document.getElementById('finger-name').value = fingerprint.name;
        document.getElementById('finger-access').value = fingerprint.access;
        
        // Disable re-enrollment for editing
        scannerMsg.textContent = 'Chỉnh sửa thông tin vân tay (không thể thay đổi vân tay)';
        
        // Change start button to update
        startEnrollBtn.textContent = 'Cập nhật';
        startEnrollBtn.onclick = function() {
            // Update existing fingerprint
            const index = fingerprints.findIndex(f => f.id === fingerprint.id);
            if (index !== -1) {
                fingerprints[index].name = document.getElementById('finger-name').value;
                fingerprints[index].access = document.getElementById('finger-access').value;
                
                renderFingerprintsTable();
            }
            
            // Reset form and button
            document.getElementById('finger-id').value = '';
            document.getElementById('finger-name').value = '';
            document.getElementById('finger-access').value = 'full';
            
            scannerMsg.textContent = 'Đặt ngón tay lên cảm biến để đăng ký vân tay mới';
            
            startEnrollBtn.textContent = 'Bắt đầu đăng ký';
            startEnrollBtn.onclick = null;
        };
    }
    
    // Delete fingerprint
    function deleteFingerprint(id) {
        if (confirm('Bạn có chắc chắn muốn xóa vân tay này?')) {
            fingerprints = fingerprints.filter(fingerprint => fingerprint.id !== id);
            renderFingerprintsTable();
            document.getElementById('total-fingerprints').textContent = fingerprints.length;
        }
    }
    
    // Load history data
    function loadHistoryData() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        scanHistory.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            const idCell = document.createElement('td');
            idCell.textContent = index + 1;
            row.appendChild(idCell);
            
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.name;
            row.appendChild(nameCell);
            
            const timestampCell = document.createElement('td');
            timestampCell.textContent = entry.timestamp;
            row.appendChild(timestampCell);
            
            historyList.appendChild(row);
        });
    }
    
    // Search fingerprints
    const searchFingerprintsInput = document.getElementById('search-fingerprints');
    searchFingerprintsInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const fingerprintsTable = document.getElementById('fingerprints-list');
        const rows = fingerprintsTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            const id = row.children[0].textContent.toLowerCase();
            const name = row.children[1].textContent.toLowerCase();
            
            if (id.includes(query) || name.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    // Initialize
    renderFingerprintsTable();
    
    // Simulate real-time updates
    function simulateRealTimeUpdates() {
        // Update last scan info
        const lastScan = scanHistory[scanHistory.length - 1];
        document.getElementById('last-scan-time').textContent = lastScan.timestamp;
        document.getElementById('last-scan-id').textContent = lastScan.fingerId;
        document.getElementById('last-scan-status').textContent = 'Access Granted';
        
        // Listen for new fingerprint scans (this would come from ERa platform in a real implementation)
        // For demo purposes, we'll simulate receiving new data
        const mockNewScan = {
            id: scanHistory.length + 1,
            fingerId: fingerprints[Math.floor(Math.random() * fingerprints.length)].id,
            name: fingerprints[Math.floor(Math.random() * fingerprints.length)].name,
            timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        };
        
        // Add new scan every 30 seconds (for simulation)
        setTimeout(() => {
            scanHistory.push(mockNewScan);
            document.getElementById('last-scan-time').textContent = mockNewScan.timestamp;
            document.getElementById('last-scan-id').textContent = mockNewScan.fingerId;
            document.getElementById('last-scan-status').textContent = 'Access Granted';
            
            // Update today's scan count
            document.getElementById('today-scans').textContent = 
                parseInt(document.getElementById('today-scans').textContent) + 1;
                
            // Refresh history if it's currently visible
            if (historyPanel.classList.contains('active')) {
                loadHistoryData();
            }
            
            simulateRealTimeUpdates();
        }, 30000);
    }
    
    // Start simulation
    simulateRealTimeUpdates();
    
    // Connect to ERa platform (this would be implemented in a real scenario)
    // For demo, we'll just show a connection
    function connectToERaPlatform() {
        // In a real implementation, this would establish a connection to ERa
        console.log("Connecting to ERa platform...");
        
        // Simulate connection established
        setTimeout(() => {
            console.log("Connected to ERa platform");
            document.getElementById('system-status').textContent = "Trực tuyến";
            document.querySelector('.status-indicator').classList.add('online');
            document.querySelector('.status-indicator').classList.remove('offline');
        }, 1500);
    }
    
    // Initialize connection
    connectToERaPlatform();
});
