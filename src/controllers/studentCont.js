const Logbook = require("../models/logbook");

module.exports = {
  dashboard: (req, res) => {
    try {
      res.render("./studentDashboard", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  log_book: (req, res) => {
    try {
      res.render("./logbook.ejs", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logBook: async (req, res) => {
    const {week, monday, tuesday, wednesday, thursday, friday} = req.body;

    const textReg = /^[a-zA-Z0-9\s,.'()\-!]+$/;
    try {
      if (!textReg.test(monday)) {
        throw new Error("Invalid text format for Monday");
      }

      if (!textReg.test(tuesday)) {
        throw new Error("Invalid text format for Tuesday");
      }

      if (!textReg.test(wednesday)) {
        throw new Error("Invalid text format for Wednesday");
      }

      if (!textReg.test(thursday)) {
        throw new Error("Invalid text format for Thursday");
      }

      if (!textReg.test(friday)) {
        throw new Error("Invalid text format for Friday");
      }

      let imgFilename = "";
      if (req.file) {
          imgFilename = req.file.filename; 
      }

       // Check if a submission for the week already exists
       const existingSubmission = await Logbook.findOne({ week });

       if (existingSubmission) {
           return res.status(400).json({ 
            success: true,
            error: "Submission for this week already exist, you can't submit again!",
            redirectURL: "/student/logbook",
          });
       }

      const logbookEntry = await Logbook.create({
        student: req.student,
        week,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        img: imgFilename 
      });
      console.log(logbookEntry);

      res.status(200).json({
        success: true,
        msg: "Weekly activity submitted successfully!",
        redirectURL: "/student/logbook",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  change_pwd: (req, res) => {
    try {
      res.render("./studentPwdChg", { res });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  student_logout: (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 4 });
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
