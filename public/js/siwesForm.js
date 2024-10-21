// Registration Form Validation
const weekForm = document.getElementById("weekForm");

weekForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Getting Error Div
  const mondayErr = document.querySelector(".mondayErr");
  const tuesdayErr = document.querySelector(".tuesdayErr");
  const wednesdayErr = document.querySelector(".wednesdayErr");
  const thursdayErr = document.querySelector(".thursdayErr");
  const fridayErr = document.querySelector(".fridayErr");
  const imgErr = document.querySelector(".imgErr");

  // Returning All the Errors
  mondayErr.innerHTML = "";
  tuesdayErr.innerHTML = "";
  wednesdayErr.innerHTML = "";
  thursdayErr.innerHTML = "";
  fridayErr.innerHTML = "";
  imgErr.innerHTML = "";

  // Getting all the value from our inputs
  const monday = weekForm.monday.value;
  const tuesday = weekForm.tuesday.value;
  const wednesday = weekForm.wednesday.value;
  const thursday = weekForm.thursday.value;
  const friday = weekForm.friday.value;
  const img = weekForm.img;
  const week = weekForm.week.value;

  // Applying Regex For the VAlidation
  const textReg = /^[a-zA-Z0-9\s,.'()\-!]+$/;


  // Writing The Validation Logic Using Statement
  if (!textReg.test(monday)) {
    mondayErr.innerHTML = "Invalid text format";
    return;
  }

  if (!textReg.test(tuesday)) {
    tuesdayErr.innerHTML = "Invalid text format";
    return;
  }

  if (!textReg.test(wednesday)) {
    wednesdayErr.innerHTML = "Invalid text format";
    return;
  }

  if (!textReg.test(thursday)) {
    thursdayErr.innerHTML = "Invalid text format";
    return;
  }

  if (!textReg.test(friday)) {
    fridayErr.innerHTML = "Invalid text format";
    return;
  }

  if (img.files.length > 0) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(img.files[0].name)) {
      imgErr.innerHTML = "Only png, jpeg, jpg image types are allowed";
      return;
    }
  } else {
    imgErr.innerHTML = "";
  }
  

  const formData = new FormData();

  formData.append("week", week);
  formData.append("monday", monday);
  formData.append("tuesday", tuesday);
  formData.append("wednesday", wednesday);
  formData.append("thursday", thursday);
  formData.append("friday", friday);
  if (img.files.length > 0) {
    formData.append("img", img.files[0]);
  }
  
 
  fetch("/student/weekForm", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      //     'Content-Type': 'application/json'
    },
    body: formData,
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
