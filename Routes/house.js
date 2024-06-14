const router = require("express").Router();
const { addHouse, getHouses } = require("../Controllers/house");
const handleFileUpload = require("../utils/fileUploads");

const keyMappings = {
  images: "images",
};


router.post("/", handleFileUpload("uploads/houses", "image", keyMappings), addHouse);
router.get("/houses", getHouses);


module.exports = router;