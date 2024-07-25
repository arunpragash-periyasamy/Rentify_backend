const path = require("path");
const mongoose = require("mongoose");
const { House, Address, Amenity, Place } = require("../Models/house");


const addHouse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      city,
      state,
      pinCode,
      doorNo,
      street,
      address,
      landmark,
      amenities,
      additionalAmenities,
      terms,
      images,
      ...houseData
    } = req.body;

    // Create and save Place
    const placeDoc = new Place({ city, state, pinCode });
    await placeDoc.save({ session });

    // Create and save Address
    const addressDoc = new Address({
      doorNo,
      street,
      address,
      landmark,
      pinCode: placeDoc._id,
    });
    await addressDoc.save({ session });

    // Handle amenities
    const amenitiesArray = amenities
      .split(",")
      .map((name) => ({ name, type: "basic" }));
    const additionalAmenitiesArray = additionalAmenities
      .split(",")
      .map((name) => ({ name, type: "additional" }));

    const allAmenities = [...amenitiesArray, ...additionalAmenitiesArray];

    const amenityDocs = await Promise.all(
      allAmenities.map(async (amenity) => {
        const amenityDoc = new Amenity(amenity);
        await amenityDoc.save({ session });
        return amenityDoc._id;
      })
    );

    // Create house with references to address and amenities
    const house = new House({
      ...houseData,
      address: addressDoc._id,
      amenities: amenityDocs,
      terms: terms.split(","),
      images: Array.isArray(images) ? images : [images],
    });

    await house.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.sendStatus(500);
  }
};

const getHouse = async (req, res) => {
  const { id } = req.params;

  try {
    const house = await House.findById(id)
      .populate({
        path: "address",
        populate: { path: "pinCode", model: "Place" },
      })
      .populate("amenities");

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Construct a more detailed response if necessary
    const response = {
      propertyName: house.propertyName,
      propertyType: house.propertyType,
      houseType: house.houseType,
      maxRooms: house.maxRooms,
      noOfBedRooms: house.noOfBedRooms,
      noOfBathrooms: house.noOfBathrooms,
      area: house.area,
      price: house.price,
      description: house.description,
      terms: house.terms,
      images: house.images,
      address: {
        doorNo: house.address.doorNo,
        street: house.address.street,
        address: house.address.address,
        landmark: house.address.landmark,
        city: house.address.pinCode.city,
        state: house.address.pinCode.state,
        pinCode: house.address.pinCode.pinCode,
      },
      amenities: house.amenities.map((amenity) => ({
        name: amenity.name,
        type: amenity.type,
      })),
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getHouses = async (req, res) => {
  try {
    let houses = await House.find().populate({
      path: "address",
      populate: { path: "pinCode", model: "Place", select: "pinCode" },
      select:"pinCode"
    }).select("propertyName pinCode images description price"); // Fetch all houses from the database
    houses = houses.map(house => {
      house.images = house.images.map(image => `http://localhost:3000/api/house/image/${image}`);
      return house;
    })
    res.status(200).json(houses); // Send the retrieved houses as JSON response
  } catch (error) {
    console.error(error); // Log any errors
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
};


const getHouseImage = async (req, res) => {
  const { fileName } = req.params;
  console.log(fileName);
    console.log(req.params);
    res.sendFile(path.join(__dirname, "../uploads/houses", fileName));
}
module.exports = { addHouse, getHouses, getHouse , getHouseImage};