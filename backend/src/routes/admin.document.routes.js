const express = require("express");

const documentController = require("../controllers/document.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get(
  "/",
  documentController.getAllDocuments
);
router.get(
  "/:documentId/file",
  documentController.getAdminDocumentFile
);

module.exports = router;