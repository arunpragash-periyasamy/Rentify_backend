const House = require("../Models/house");


const addHouse = async (req, res) => {
    try {
        const house = new House(req.body);
        await house.save();
        console.log(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}


const getHouses = async (req, res) => {
  try {
    const houses = await House.find(); // Fetch all houses from the database
    res.status(200).json(houses); // Send the retrieved houses as JSON response
  } catch (error) {
    console.error(error); // Log any errors
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
};

module.exports = { addHouse, getHouses };