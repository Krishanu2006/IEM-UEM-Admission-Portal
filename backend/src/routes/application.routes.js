const express = require("express");

const applicationController = require("../controllers/application.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("STUDENT"));

router.post("/", applicationController.createApplication);

router.get("/", applicationController.getApplication);

router.put("/", applicationController.updateApplication);

router.post(
  "/submit",
  applicationController.submitApplication
);

module.exports = router;