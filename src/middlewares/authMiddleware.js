const jwt = require("jsonwebtoken");
const SchGenCord = require("../models/schGenCord");
const User = require("../models/user")

const checkSchGenCord = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);

  if (!token || token === undefined) {
    return res.redirect("/schGenCord-signin");
  }

  if (token) {
    jwt.verify(token, process.env.SECRET, async (error, decodedToken) => {
      if (error) {
        if (error.message == "jwt expired") {
          return res.redirect("/schGenCord-signin");
        }
        return res.redirect("/schGenCord-signin");
      } else {
        const _schGenCord = await SchGenCord.findOne(
          { _id: decodedToken.id },
          { password: 0 }
        );
        if (_schGenCord) {
          req.schGenCord = decodedToken.id;
          res.locals.schGenCord = _schGenCord;
          next();
        } else {
          res.locals.schGenCord = null;
          return res.redirect("/schGenCord-signin");
        }
      }
    });
  } else {
    return res.redirect("/schGenCord-signin");
  }
};

const checkDeptCord = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);

  if (!token || token === undefined) {
    return res.redirect("/login");
  }

  if (token) {
    jwt.verify(token, process.env.SECRET, async (error, decodedToken) => {
      if (error) {
        if (error.message == "jwt expired") {
          return res.redirect("/login");
        }
        return res.redirect("/login");
      } else {
        const _deptCord = await User.findOne(
          { _id: decodedToken.id },
          { password: 0 }
        );
        if (_deptCord) {
          req.deptCord = decodedToken.id;
          res.locals.deptCord = _deptCord;
          next();
        } else {
          res.locals.deptCord = null;
          return res.redirect("/login");
        }
      }
    });
  } else {
    return res.redirect("/login");
  }
};

const checkStudent = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token || token === undefined) {
    return res.redirect("/login");
  }

  jwt.verify(token, process.env.SECRET, async (error, decodedToken) => {
    if (error) {
      return res.redirect("/login");
    } else {
      const _student = await User.findOne({ _id: decodedToken.id }, { password: 0 });
      if (_student) {
        req.student = decodedToken.id;
        res.locals.student = _student;
        next();
      } else {
        res.locals.student = null;
        return res.redirect("/login");
      }
    }
  });
};

module.exports = { checkSchGenCord, checkDeptCord, checkStudent };
