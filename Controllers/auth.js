const User = require("../Models/user");
const { generateToken } = require("../utils/jwtToken");
const signup = async (req, res) => {
    try {
        const { userName, email, phone} = req.body;
        const user = await User.findOne({ $or: [{ email: email }, { phone: phone }, { userName: userName }] });
        if (user) {
            return res.status(400).send("User already exists");
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send("user created successfully");
    } catch (err) {
        console.log("Error occured");
        console.log(err)
        res.status(500).send(err)
    }
}


const login = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const user = await User.findOne({ $or:[{userName} , {email}] });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).send("Invalid password");
        }
        console.log(user._id);
        const token = await generateToken({ userId: user._id });
        console.log(token);
        res.cookie("token",token).status(200).send("Login successful");
    } catch (err) {
        console.log("Error occured");
        console.log(err)
        res.status(500).send(err)
    }
}


module.exports={signup, login}