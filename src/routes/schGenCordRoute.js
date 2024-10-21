const express =  require("express");
const schGenCordCont = require("../controllers/schGenCordCont");
const { checkSchGenCord } = require("../middlewares/authMiddleware");
const route = express.Router();

route.get('/dashboard', checkSchGenCord, schGenCordCont.dashbaord);
route.get('/approvedStds', checkSchGenCord, schGenCordCont.approvedStds);
route.get('/register', checkSchGenCord, schGenCordCont.get_register);
route.post('/register', checkSchGenCord, schGenCordCont.register);
route.get('/student-works', checkSchGenCord, schGenCordCont.student_works);
route.get('/change-password', checkSchGenCord, schGenCordCont.change_password);

route.post('/register-schGenCord', schGenCordCont.register_schGenCord);
route.get('/schGenCord-signin', schGenCordCont.schGenCord_login);
route.post('/schGenCord-signin', schGenCordCont.schGenCordLogin);
route.get('/schGenCord-logout', schGenCordCont.schGenCord_logout);

route.get('/dept-cordinators', checkSchGenCord, schGenCordCont.dept_cordinators);
route.get('/register-deptCordinator', checkSchGenCord, schGenCordCont.reg_deptCord);
route.post('/register-deptCordinator', checkSchGenCord, schGenCordCont.registerDeptCord);

route.get('/student-work', checkSchGenCord, schGenCordCont.view_ITStudents);
route.get('/workdone', checkSchGenCord, schGenCordCont.workdone);

module.exports = route;