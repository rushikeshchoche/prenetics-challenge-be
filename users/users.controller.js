const express = require("express");
const router = express.Router();
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticate);
router.get("/retrieveUser", retrieveUserData);
router.get("/retrieveGenetic", retrieveGeneticResult);

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function retrieveUserData(req, res, next) {
  userService
    .retrieveUserData(req.query)
    .then((users) => res.json(users))
    .catch(next);
}

function retrieveGeneticResult(req, res, next) {
  userService
    .retrieveGeneticResult(req.query)
    .then((users) => res.json(users))
    .catch(next);
}
