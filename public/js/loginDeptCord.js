const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  ///Fetching Error Divs
  const schReg_noErr = document.querySelector(".schReg_noErr");
  const passwordErr = document.querySelector(".passwordErr");

  // //Resetting Regex
  schReg_noErr.innerHTML = "";
  passwordErr.innerHTML = "";

  //Getting Input Values
  const schReg_no = loginForm.schReg_no.value;
  const password = loginForm.password.value;

  // Regex for the Inputs

  const schReg_noReg = /^\d{4}\/[a-zA-Z]{2}\/\d+$/;
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+\[\]{}|;:,.<>?]).{8,}$/;

  // If Statements
  if (!schReg_noReg.test(schReg_no)) {
    schReg_noErr.innerHTML = "Incorrect Registration Number";
    return;
  }

  if (!passwordReg.test(password)) {
    passwordErr.innerHTML = "Incorrect Password";
  }

  const data = { schReg_no, password };

  fetch("/login", {
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
