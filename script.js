document.addEventListener('DOMContentLoaded', function() {
  // Navigation functionality
  document.getElementById('home-link').addEventListener('click', showHomeSection);
  document.getElementById('students-link').addEventListener('click', showStudentsSection);
  document.getElementById('services-link').addEventListener('click', showServicesSection);
  document.getElementById('about-link').addEventListener('click', showAboutSection);
  
  // Home section buttons
  document.getElementById('new-user-reg').addEventListener('click', showRegistrationForm);
  
  document.getElementById("students-list").addEventListener('click', showStudentsSection);
  // Students section buttons
  document.getElementById('new-student-reg').addEventListener('click', showRegistrationForm);
  document.getElementById('students-back-btn').addEventListener('click', showHomeSection);
  
  // Initialize student data
  let students = JSON.parse(localStorage.getItem('students')) || [];
  let isUpdating = false;
  let updatingIndex = -1;
  let formSubmitted = false;
  
  // Helper functions
  const isAlpha = str => /^[A-Za-z]+$/.test(str);
  const isPhone = str => /^\d{10}$/.test(str);
  const isEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  const isAddress = str => /^[A-Za-z0-9/ ,.-]+$/.test(str);
  const toTitleCase = str => str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  
  // Section management
  function showHomeSection() {
    hideAllSections();
    document.getElementById('home-section').style.display = 'block';
  }
  
  function showRegistrationForm() {
    hideAllSections();
    document.getElementById('registration-section').style.display = 'block';
  }
  
  function showStudentsSection() {
    hideAllSections();
    document.getElementById('students-section').style.display = 'block';
    refreshStudentTable();
  }
  
  function showServicesSection() {
    hideAllSections();
    document.getElementById('services-section').style.display = 'block';
  }
  
  function showAboutSection() {
    hideAllSections();
    document.getElementById('about-section').style.display = 'block';
  }
  
  function hideAllSections() {
    const sections = document.querySelectorAll('#content-area > div');
    sections.forEach(section => {
      section.style.display = 'none';
    });
  }
  
  // Form functionality
  document.getElementById("copyAddress").addEventListener("change", function() {
    if (this.checked) {
      document.getElementById("permanentAddress").value = document.getElementById("currentAddress").value;
    }
  });
  
  // Percentage sliders
  const tenth = document.getElementById("tenth");
  const inter = document.getElementById("inter");
  const tenthVal = document.getElementById("tenthVal");
  const interVal = document.getElementById("interVal");
  
  function updatePercentageDisplay() {
    tenthVal.textContent = `${tenth.value}%`;
    interVal.textContent = `${inter.value}%`;
    tenthVal.style.color = tenth.value === "0" ? "red" : "black";
    interVal.style.color = inter.value === "0" ? "red" : "black";
  }
  
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
  
  // Form validation
  const requiredFields = ["firstName", "lastName", "fatherName", "motherName", "phone", "email", "currentAddress", "permanentAddress", "course"];
  
  requiredFields.forEach(id => {
    document.getElementById(id).addEventListener("input", function() {
      if (formSubmitted) validateField(id);
    });
  });
  
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
  document.getElementById("registrationForm").addEventListener("submit", function(e) {
    e.preventDefault();
    formSubmitted = true;
  
    // Validate all fields
    let allValid = true;
    
    requiredFields.forEach(id => {
      if (!validateField(id)) allValid = false;
    });
  
    // Validate percentages
    updatePercentageDisplay();
    if (tenth.value === "0" || inter.value === "0") {
      alert("Please set both percentage values above 0");
      allValid = false;
    }
  
    if (!allValid) return;
  
    // Prepare student data
    const student = {
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
      timestamp: new Date().toISOString()
    };
  
    // Check for duplicates
    const isDuplicate = students.some((s, i) => 
      s.firstName === student.firstName && 
      s.lastName === student.lastName && 
      s.phone === student.phone &&
      i !== updatingIndex
    );
  
    if (isDuplicate) {
      alert("This student is already registered!");
      return;
    }
  
    if (isUpdating) {
      // Update existing student
      students[updatingIndex] = student;
      isUpdating = false;
      updatingIndex = -1;
    } else {
      // Add new student
      students.push(student);
    }
  
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));
  
    // Refresh table
    refreshStudentTable();
  
    // Reset form
    this.reset();
    tenth.value = 0;
    inter.value = 0;
    updatePercentageDisplay();
    formSubmitted = false;
    document.querySelector('button[type="submit"]').textContent = "Register Student";
  });
  
  // Student table management
  function addStudentToTable(student, index) {
    const row = document.createElement("tr");
    const fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
    
    row.innerHTML = `
      <td>${fullName}</td>
      <td>${student.phone}</td>
      <td>${student.email}</td>
      <td>${student.course}</td>
      <td>${student.tenthPercent}%</td>
      <td>${student.interPercent}%</td>
      <td>
        <button class="update-btn" data-index="${index}">Update</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;
    
    document.getElementById("studentTable").appendChild(row);
  }
  
  function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
      students.splice(index, 1);
      localStorage.setItem('students', JSON.stringify(students));
      refreshStudentTable();
    }
  }
  
  function updateStudent(index) {
    const student = students[index];
    sessionStorage.setItem('studentToUpdate', student.timestamp);
    window.location.href = 'update-student.html';
  }
  
  function refreshStudentTable() {
    const table = document.getElementById("studentTable");
    table.innerHTML = '';
    students.forEach((student, index) => addStudentToTable(student, index));
  }
  
  // Event delegation for update and delete buttons
  document.getElementById("studentTable").addEventListener("click", function(e) {
    if (e.target.classList.contains('delete-btn')) {
      const index = e.target.getAttribute('data-index');
      deleteStudent(index);
    } else if (e.target.classList.contains('update-btn')) {
      const index = e.target.getAttribute('data-index');
      updateStudent(index);
    }
  });
  
  // Initialize
  refreshStudentTable();
  updatePercentageDisplay();
  showHomeSection();
});