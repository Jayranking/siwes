const express = require('express');
const studentCont = require('../controllers/studentCont');
const route = express.Router();
const {checkStudent} = require('../middlewares/authMiddleware');
const {profileHandler} = require('../helpers/img_handler');

route.get('/dashboard', checkStudent, studentCont.dashboard);

route.get('/logbook', checkStudent, studentCont.log_book);
route.post('/weekForm', profileHandler, checkStudent, studentCont.logBook);

route.get('/change-password', checkStudent, studentCont.change_pwd);
route.get('/logout', checkStudent, studentCont.student_logout);


module.exports = route;