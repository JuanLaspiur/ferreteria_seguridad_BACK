const { Router } = require("express");

const { search: controller } = require("../controllers");

const router = Router();

router.get(
  "/:collection/:term",
  controller.search
);

module.exports = router;
