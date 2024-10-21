const Logbook = require("../models/logbook");

module.exports = {
  dashboard: (req, res) => {
    try {
      res.render("./deptCordDashboard.ejs", { res });
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

      res.render("./viewItStudents.ejs", { res, context });
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
      res.render("./workdone.ejs", { logbooks, res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  change_pwd: (req, res) => {
    try {
      res.render("./deptCordpwdChg.ejs", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deptCord_logout: (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 4 });
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
