const sheetId = '1Q40DsVP-uUDhmcgO9SCt5oihxjAHtXXNuaQeTl6BJxs';  // Thay bằng ID Google Sheet của bạn
const apiKey = 'e4c3e35c6ba4489811e5e05d5098f76e66aca6a6';    // Thay bằng API key của bạn
const sheetName = 'Sheet1';       // Tên sheet chứa dữ liệu

// Lấy dữ liệu nhân viên từ Google Sheets
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`)
    .then(response => response.json())
    .then(data => populateEmployeeList(data.values));

// Hiển thị danh sách nhân viên
function populateEmployeeList(data) {
    const employeeSelect = document.getElementById('employee');
    data.slice(1).forEach(row => {  // Bỏ qua dòng tiêu đề
        const option = document.createElement('option');
        option.value = row[0];  // Mã nhân viên
        option.textContent = `${row[0]} - ${row[1]}`;  // Hiển thị mã và tên
        employeeSelect.appendChild(option);
    });
}

// Hiển thị chi tiết nhân viên khi chọn
function loadEmployeeDetails() {
    const selectedCode = document.getElementById('employee').value;
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const employee = data.values.find(row => row[0] === selectedCode);
            if (employee) {
                document.getElementById('dob').textContent = employee[2];
                document.getElementById('gender').textContent = employee[3];
                document.getElementById('department').textContent = employee[4];
                document.getElementById('position').textContent = employee[5];
                document.getElementById('status').textContent = employee[6];
            }
        });
}

// Gửi đánh giá và lưu vào Google Sheets
function submitEvaluation() {
    const selectedEmployee = document.getElementById('employee').value;
    const q1 = document.querySelector('input[name="q1"]:checked').value;
    const q2 = document.querySelector('input[name="q2"]:checked').value;
    const comments = document.getElementById('comments').value;

    const data = {
        employee: selectedEmployee,
        q1: q1,
        q2: q2,
        comments: comments
    };

    // Gọi API Google Apps Script để lưu dữ liệu (sẽ hướng dẫn ở bước tiếp theo)
    fetch('https://script.google.com/macros/s/AKfycbwBJN86NRcdIuH-POre7ZWsdh94lEtWd1MikYYKG_dFHqn1xpNPH-DXWbKKgykM-DLB/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        if (response.ok) alert('Đánh giá đã được gửi thành công!');
        else alert('Có lỗi xảy ra khi gửi đánh giá.');
    });
}
