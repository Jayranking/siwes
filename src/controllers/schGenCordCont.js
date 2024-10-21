const SchGenCord = require("../models/schGenCord");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { sendEmail, generatePassword } = require("../helpers/util");
const Logbook = require("../models/logbook");

module.exports = {
  dashbaord: (req, res) => {
    try {
      res.render("./dashboard", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approvedStds: async(req, res) => {
    const context = {};
    try {
      const _approvedStds = await User.find({role: "student"});
      context['approvedStds'] = _approvedStds;

      res.render("./approvedStds", { res, context});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  view_ITStudents: async (req, res) => {
    const context = {};
    try {
      // Fetch all logbooks with populated student details
      const _logbook = await Logbook.find().populate("student");

      // Create a dictionary to hold each student's logbooks
      const students = {};

      // Group logbooks by student
      _logbook.forEach((log) => {
        const studentId = log.student._id.toString();

        if (!students[studentId]) {
          // If the student has no previous logbooks, initialize their entry
          students[studentId] = {
            student: log.student,
            logbooks: [],
          };
        }

        // Push each week's logbook entry
        students[studentId].logbooks.push(log);
      });

      // Convert object to array of students with logbooks
      context["students"] = Object.values(students);

      res.render("./itworksGen.ejs", { res, context });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  workdone: async (req, res) => {
    try {
      // Fetch the student ID from the query parameters
      const studentId = req.query.student;

      // Find the student's logbooks by their ID and populate the student details
      const logbooks = await Logbook.find({ student: studentId }).populate(
        "student"
      );

      if (!logbooks.length) {
        return res
          .status(404)
          .json({ message: "No logbooks found for this student." });
      }

      // Render the page and pass the logbook details
      res.render("./viewWorkdoneGen.ejs", { logbooks, res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_register: (req, res) => {
    try {
      res.render("./register", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  register: async(req, res) => {
    const { fullname, faculty, dept, email, phone_no, schReg_no, gender } =
      req.body;

    const fullnameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const reg_noReg = /^\d{4}\/[a-zA-Z]{2}\/\d+$/;
    const phoneReg = /^0[1-9]\d{9}$/;
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
      if (!fullnameReg.test(fullname)) {
        throw new Error("Invalid fullname format");
      }

      if (faculty == "") {
        throw new Error("Select your Faculty");
      }

      if (dept == "") {
        throw new Error("Select your Department");
      }

      if (!emailReg.test(email)) {
        throw new Error("Invalid email address");
      }

      if (!phoneReg.test(phone_no)) {
        throw new Error("Invalid phone number input");
      }

      if (!reg_noReg.test(schReg_no)) {
        throw new Error("Incorrect input");
      }

      if (gender == "") {
        throw new Error("Select your gender");
      }

      // ================Generate random password===============
      const password = generatePassword(12);
      console.log(password);

      const student = await User.create({
        fullname,
        faculty,
        dept,
        email,
        phone_no,
        schReg_no,
        gender,
        role: "student",
        password: password,
      });
      console.log(student);

      const mailBody = `Your account has been created successfully. Please use the login
            credential below to log in to your account: <br> <br>
            Registration Number: <b>${schReg_no}</b> <br>
            Password: <b>${password}</b> <br> <br>
            You are advised to change the default password after successful login. 
            Click on the button below to login to your account <br><br>
            <a href="/login">Click here to login</a> `;

      // ===================Notify Lecturer through email==================
      sendEmail(email, "Account Created", mailBody);
      return res.status(200).json({
        success: true,
        msg: "Account created successfully",
        redirectURL: "/approvedStds",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  student_works: (req, res) => {
    try {
      res.render("./studentWork", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  change_password: (req, res) => {
    try {
      res.render("./schCordPwdChg", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  register_schGenCord: async (req, res) => {
    const { fullname, email, phone_no } = req.body;

    const fullnameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneReg = /^0[1-9]\d{9}$/;

    try {
      if (!fullnameReg.test(fullname)) {
        throw new Error("Invalid name format");
      }

      if (!emailReg.test(email)) {
        throw new Error("Invalid email address");
      }

      if (!phoneReg.test(phone_no)) {
        throw new Error("Invalid phone number input");
      }

      // Create user and put in db
      const schGenCord = await SchGenCord.create({
        fullname,
        email,
        phone_no,
        password: "Password@2",
      });
      console.log(schGenCord);

      return res.status(200).json({
        success: true,
        msg: "Account created successfully",
        redirectURL: "/schGenCord-signin",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  schGenCord_login: (req, res) => {
    return res.render("./schGenCordLogin");
  },
  schGenCordLogin: async (req, res) => {
    const { email, password } = req.body;
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const pwdReg = /^(?:[0-9A-Za-z!@#$%^&*()\-+=_{}\[\]|:;"'<>,.?\\/ ])+$/;

    try {
      if (!emailReg.test(email)) {
        throw new Error("Invalid email address");
      }

      if (!pwdReg.test(password)) {
        throw new Error("Incorrect password");
      }

      // invoke the static login method
      const isLoggedIn = await SchGenCord.login(email, password);

      if (isLoggedIn) {
        // Generate JWT token
        const token = jwt.sign({ id: isLoggedIn._id }, process.env.SECRET, {
          expiresIn: 1000 * 60 * 60 * 24,
        });
        // console.log(token);

        // send JWT to cookie
        res.cookie("jwt", token, { maxAge: 4000 * 60 * 60 });

        return res.status(200).json({
          success: true,
          msg: "Login Successfully",
          redirectURL: "/dashboard",
          schGenCord: isLoggedIn,
        });
      }
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  },
  schGenCord_logout: (req, res) => {
    res.cookie("jwt", "", { maxAge: 4 });
    res.redirect("/schGenCord-signin");
  },

  dept_cordinators: async(req, res) => {
    const context = {};
    try {
      const _deptCordinators = await User.find({role : "lecturer"});
      context['deptCordinators'] = _deptCordinators;

      res.render("./deptCordinators", { res, context });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  reg_deptCord: (req, res) => {
    try {
      res.render("./registerDeptCord", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  registerDeptCord: async (req, res) => {
    const { fullname, faculty, dept, email, phone_no, schReg_no, gender } =
      req.body;

    const fullnameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const reg_noReg = /^\d{4}\/[a-zA-Z]{2}\/\d+$/;
    const phoneReg = /^0[1-9]\d{9}$/;
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
      if (!fullnameReg.test(fullname)) {
        throw new Error("Invalid fullname format");
      }

      if (faculty == "") {
        throw new Error("Select your Faculty");
      }

      if (dept == "") {
        throw new Error("Select your Department");
      }

      if (!emailReg.test(email)) {
        throw new Error("Invalid email address");
      }

      if (!phoneReg.test(phone_no)) {
        throw new Error("Invalid phone number input");
      }

      if (!reg_noReg.test(schReg_no)) {
        throw new Error("Incorrect input");
      }

      if (gender == "") {
        throw new Error("Select your gender");
      }

      // ================Generate random password===============
      const password = generatePassword(12);
      console.log(password);

      const deptCordinator = await User.create({
        fullname,
        faculty,
        dept,
        email,
        phone_no,
        schReg_no,
        gender,
        role: "lecturer",
        password: password,
      });
      console.log(deptCordinator);

      const mailBody = `Your account has been created successfully. Please use the login
            credential below to log in to your account: <br> <br>
            Registration Number: <b>${schReg_no}</b> <br>
            Password: <b>${password}</b> <br> <br>
            You are advised to change the default password after successful login. 
            Click on the button below to login to your account <br><br>
            <a href="/login">Click here to login</a> `;

      // ===================Notify Lecturer through email==================
      sendEmail(email, "Account Created", mailBody);
      return res.status(200).json({
        success: true,
        msg: "Account created successfully",
        redirectURL: "/dept-cordinators",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },


};
