const express = require("express");
const router = express.Router();
const {
  getSpaces,
  createSpaces,
  joinSpace,
  updateSpaces,
  deleteSpaces,
  getSpaceData,
} = require("../controllers/spaceController");

const auth = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuthMiddleware");

router.get("/", auth, getSpaces);
router.post("/", auth, createSpaces);
router.post("/:id/join", auth, joinSpace);
router.get("/:id", optionalAuth, getSpaceData);
router.put("/:id", auth, updateSpaces);
router.delete("/:id", auth, deleteSpaces);

module.exports = router;
