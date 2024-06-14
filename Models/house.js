const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const houseSchema = new Schema({
    propertyName: {
        type: String,
    },
    propertyType: {
        type: String,
    },
    doorNo: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pinCode: {
        type: Number,
    },
    street: {
        type: String,
    },
    address: {
        type: String,
    },
    landmark: {
        type: String,
    },
    houseType: {
        type: String,
        enum:["flat","independent house"],
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
    amenities: {
        type: [String],
    },
    additionalAmenities: {
        type: [String],
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
    }

})

const House = mongoose.model("house", houseSchema);

module.exports=House;