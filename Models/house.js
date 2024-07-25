const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const placeSchema = new Schema({
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
});

const Place = mongoose.model("Place", placeSchema);

const addressSchema = new Schema({
  doorNo: {
    type: String,
  },
  street: {
    type: String,
  },
  address: {
    type: String,
    },
  pinCode: {
      type: Schema.Types.ObjectId,
      ref: "Place"
  },
  landmark: {
    type: String,
  },
});

const Address = mongoose.model("Address", addressSchema);


const amenitiesSchema = new Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    enum: ["basic", "additional"],
  },
});

const Amenity = mongoose.model("Amenity", amenitiesSchema);

const houseSchema = new Schema({
    propertyName: {
        type: String,
    },
    propertyType: {
        type: String,
    },
    houseType: {
        type: String,
        enum:["flat","independentHouse", "office"],
    },
    maxRooms: {
        type: Number,
    },
    noOfBedRooms: {
        type: Number,
    },
    noOfBathrooms: {
        type: Number,
    },
    area: {
        type: Number,
    },
    terms: {
        type: [String],
    },
    price: {
        type: Number,
    },
    images: {
        type: [String],
    },
    description: {
        type: String,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref:"Address"
    },
    amenities: {
        type: [Schema.Types.ObjectId],
        ref: "Amenity"
    }
})

const House = mongoose.model("house", houseSchema);

module.exports={House, Address, Place, Amenity};