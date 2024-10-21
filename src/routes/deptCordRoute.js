const express = require('express');
const deptCordCont = require('../controllers/deptCordCont');
const {checkDeptCord} =  require('../middlewares/authMiddleware')
const router = express.Router();

router.get('/dashboard',checkDeptCord, deptCordCont.dashboard);
router.get('/IT-students', checkDeptCord, deptCordCont.view_ITStudents);
router.get('/workdone', checkDeptCord, deptCordCont.workdone);
router.get('/change-password', checkDeptCord, deptCordCont.change_pwd);
router.get('/logout', deptCordCont.deptCord_logout);


module.exports = router;