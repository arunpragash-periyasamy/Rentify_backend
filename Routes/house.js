const router = require("express").Router();
const { addHouse, getHouses, getHouse, getHouseImage } = require("../Controllers/house");
const handleFileUpload = require("../utils/fileUploads");

const keyMappings = {
  images: "images",
};


router.post("/", handleFileUpload("uploads/houses", "image", keyMappings), addHouse);
router.get("/houses", getHouses);
router.get("/:id", getHouse);
router.get("/image/:fileName", getHouseImage);


module.exports = router;