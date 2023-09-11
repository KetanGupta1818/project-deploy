const express = require('express');
const router = express.Router();

const {getAllProblems,userProblems} = require('../controllers/problems');

router.route("/").get(getAllProblems);
router.route("/").post(userProblems);
module.exports = router;