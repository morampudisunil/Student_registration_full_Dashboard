document.addEventListener('DOMContentLoaded', function() {
  // Helper functions
  const isAlpha = str => /^[A-Za-z]+$/.test(str);
  const isPhone = str => /^\d{10}$/.test(str);
  const isEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  const isAddress = str => /^[A-Za-z0-9/ ,.-]+$/.test(str);
  const toTitleCase = str => str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

  // Load student data
  let students = JSON.parse(localStorage.getItem('students')) || [];
  let studentId = sessionStorage.getItem('studentToUpdate');
  let studentIndex = students.findIndex(s => s.timestamp === studentId);

  // DOM elements
  const tenth = document.getElementById("tenth");
  const inter = document.getElementById("inter");
  const tenthVal = document.getElementById("tenthVal");
  const interVal = document.getElementById("interVal");

  // Load student data into form
  function loadStudentData() {
    if (studentIndex === -1) {
      alert('Student not found!');
      window.location.href = 'index.html';
      return;
    }

    const student = students[studentIndex];
    
    document.getElementById("firstName").value = student.firstName;
    document.getElementById("middleName").value = student.middleName || '';
    document.getElementById("lastName").value = student.lastName;
    document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
    document.getElementById("phone").value = student.phone;
    document.getElementById("email").value = student.email;
    document.getElementById("currentAddress").value = student.currentAddress;
    document.getElementById("permanentAddress").value = student.permanentAddress;
    document.getElementById("course").value = student.course;
    document.getElementById("fatherName").value = student.fatherName;
    document.getElementById("motherName").value = student.motherName;
    document.getElementById("physicallyChallenged").checked = student.physicallyChallenged;
    document.getElementById("tenth").value = student.tenthPercent;
    document.getElementById("inter").value = student.interPercent;
    
    updatePercentageDisplay();
  }

  // Update percentage displays
  function updatePercentageDisplay() {
    tenthVal.textContent = `${tenth.value}%`;
    interVal.textContent = `${inter.value}%`;
    tenthVal.style.color = tenth.value === "0" ? "red" : "black";
    interVal.style.color = inter.value === "0" ? "red" : "black";
  }

  // Form validation
  const requiredFields = ["firstName", "lastName", "fatherName", "motherName", "phone", "email", "currentAddress", "permanentAddress", "course"];

  function validateField(id) {
    const value = document.getElementById(id).value.trim();
    const errorElement = document.getElementById(id + "Error");
    
    if (!value) {
      errorElement.textContent = "This field is required";
      return false;
    }

    let isValid = true;
    
    switch(id) {
      case "firstName":
      case "middleName":
      case "lastName":
      case "fatherName":
      case "motherName":
        isValid = isAlpha(value) && value.length >= 3;
        errorElement.textContent = isValid ? "" : "Name should be min 3 alphabetic characters";
        break;
      case "phone":
        isValid = isPhone(value);
        errorElement.textContent = isValid ? "" : "Enter 10 digit phone number";
        break;
      case "email":
        isValid = isEmail(value);
        errorElement.textContent = isValid ? "" : "Enter valid email";
        break;
      case "currentAddress":
      case "permanentAddress":
        isValid = isAddress(value);
        errorElement.textContent = isValid ? "" : "Invalid address characters";
        break;
      default:
        errorElement.textContent = "";
    }
    
    return isValid;
  }

  // Form submission
  document.getElementById("updateForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    requiredFields.forEach(id => {
      if (!validateField(id)) allValid = false;
    });

    // Validate percentages
    if (tenth.value === "0" || inter.value === "0") {
      alert("Please set both percentage values above 0");
      allValid = false;
    }

    if (!allValid) return;

    // Prepare updated student data
    const updatedStudent = {
      firstName: toTitleCase(document.getElementById("firstName").value.trim()),
      middleName: toTitleCase(document.getElementById("middleName").value.trim()),
      lastName: toTitleCase(document.getElementById("lastName").value.trim()),
      gender: document.querySelector('input[name="gender"]:checked').value,
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      currentAddress: document.getElementById("currentAddress").value.trim(),
      permanentAddress: document.getElementById("permanentAddress").value.trim(),
      course: document.getElementById("course").value,
      fatherName: toTitleCase(document.getElementById("fatherName").value.trim()),
      motherName: toTitleCase(document.getElementById("motherName").value.trim()),
      physicallyChallenged: document.getElementById("physicallyChallenged").checked,
      tenthPercent: tenth.value,
      interPercent: inter.value,
      timestamp: studentId
    };

    // Update student in array
    students[studentIndex] = updatedStudent;
    localStorage.setItem('students', JSON.stringify(students));
    
    // Redirect back to main page
    window.location.href = 'index.html';
  });

  // Cancel button
  document.getElementById("cancelBtn").addEventListener("click", function() {
    window.location.href = 'index.html';
  });

  // Address copy functionality
  document.getElementById("copyAddress").addEventListener("change", function() {
    if (this.checked) {
      document.getElementById("permanentAddress").value = document.getElementById("currentAddress").value;
    }
  });

  // Percentage slider events
  tenth.addEventListener("input", updatePercentageDisplay);
  inter.addEventListener("input", updatePercentageDisplay);

  // Input restrictions
  ["firstName", "middleName", "lastName", "fatherName", "motherName"].forEach(id => {
    document.getElementById(id).addEventListener("keypress", e => {
      if (!/[a-zA-Z]/.test(e.key)) e.preventDefault();
    });
  });

  document.getElementById("phone").addEventListener("keypress", e => {
    if (!/[0-9]/.test(e.key) || e.target.value.length >= 10) e.preventDefault();
  });

  // Initialize
  if (!studentId || studentIndex === -1) {
    window.location.href = 'index.html';
    return;
  }
  
  loadStudentData();
  updatePercentageDisplay();
});