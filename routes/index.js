const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const user = require("./user");
const profile = require ("./profile");
const events = require("./events");

// API Routes
router.use("/api", apiRoutes);
router.use("/user",user);
router.use("/profile", profile);
router.use("/events",events);

// If no API routes are hit, send the React app
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
