// Registration Form Validation
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Getting Error Div
  const fullnameError = document.querySelector(".fullnameError");
  const facultyErr = document.querySelector(".facultyErr");
  const deptErr = document.querySelector(".deptErr");
  const emailErr = document.querySelector(".emailErr");
  const phone_noErr = document.querySelector(".phone_noErr");
  const schReg_noErr = document.querySelector(".schReg_noErr");
  const genderErr = document.querySelector(".genderErr");

  // Returning All the Errors
  fullnameError.innerHTML = "";
  facultyErr.innerHTML = "";
  deptErr.innerHTML = "";
  emailErr.innerHTML = "";
  phone_noErr.innerHTML = "";
  schReg_noErr.innerHTML = "";
  genderErr.innerHTML = "";

  // Getting all the value from our inputs
  const fullname = registerForm.fullname.value;
  const faculty = registerForm.faculty.value;
  const dept = registerForm.dept.value;
  const email = registerForm.email.value;
  const phone_no = registerForm.phone_no.value;
  const schReg_no = registerForm.schReg_no.value;
  const gender = registerForm.gender.value;

  // Applying Regex For the VAlidation
  const fullnameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  const reg_noReg = /^\d{4}\/[a-zA-Z]{2}\/\d+$/;
  const phoneReg = /^0[1-9]\d{9}$/;
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Writing The Validation Logic Using Statement

  if (!fullnameReg.test(fullname)) {
    fullnameError.innerHTML = "Invalid fullname format";
    return;
  }

  if (faculty == "") {
    facultyErr.innerHTML = "Select your Faculty";
    return;
  }

  if (dept == "") {
    deptErr.innerHTML = "Select your Department";
    return;
  }

  if (!emailReg.test(email)) {
    emailErr.innerHTML = "Invalid email address";
    return;
  }

  if (!phoneReg.test(phone_no)) {
    phone_noErr.innerHTML = "Invalid phone number input";
    return;
  }

  if (!reg_noReg.test(schReg_no)) {
    schReg_noErr.innerHTML = "Incorrect input";
    return;
  }

  if (gender == "") {
    genderErr.innerHTML = "Select your gender";
    return;
  }

  const data = {fullname, faculty, dept, email, phone_no, schReg_no, gender};

  fetch("/register", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        $(document).ready(() => {
          iziToast.success({
            title: "Ok",
            message: data.msg,
          });
        });

        setInterval(() => {
          window.location.href = data.redirectURL;
        }, 2000);
      }
      if (data.error) {
        // Invoke the toast component
        $(document).ready(() => {
          iziToast.error({
            title: "Error",
            message: data.error,
          });
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
