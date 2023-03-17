const express = require("express");
const router = express.Router();
const {
  getSpaces,
  createSpaces,
  updateSpaces,
  deleteSpaces,
  getSpaceData,
  updateActive,
  verifySpace,
} = require("../controllers/spaceController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getSpaces);
router.post("/", auth, createSpaces);
router.get("/:id", getSpaceData);
router.put("/:id", auth, updateSpaces);
router.delete("/:id", auth, deleteSpaces);
router.put("/updateActive/:id", updateActive);
router.get("/verify/:id", verifySpace);

module.exports = router;
