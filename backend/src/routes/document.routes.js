const express = require("express");

const documentController = require("../controllers/document.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("STUDENT"));

router.post(
  "/",
  upload.single("document"),
  documentController.uploadDocument
);

router.get(
  "/",
  documentController.getDocuments
);
router.delete(
  "/:documentId",
  documentController.deleteDocument
);

module.exports = router;