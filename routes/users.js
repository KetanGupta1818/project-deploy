const express = require('express');
const router = express.Router();

const {displayAllUsers,addUser} = require('../controllers/users');

router.route("/").get(displayAllUsers);
router.route("/").post(addUser);

module.exports = router;