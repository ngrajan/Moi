import express from "express";

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("Dummy Route is working!");
});

export default router;
