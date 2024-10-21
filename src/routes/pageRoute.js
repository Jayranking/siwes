const express =  require("express");
const pageCont = require("../controllers/pageCont");
const router = express.Router();

router.get('/', pageCont.index);
router.get('/login', pageCont.get_login);
router.post('/login', pageCont.login);

module.exports = router; 