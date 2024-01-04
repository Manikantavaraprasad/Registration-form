const express = require("express")
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/registration", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`connection sucessful`);
}).catch((e) => {
    console.log(`no connection`);
})

//registration schema
const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile_no: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//mode of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyparser.json());


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})



app.post("/register", async(req, res) => {
    try {
        const { name, email, mobile_no, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        //Check for existing user        
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                mobile_no,
                password
            });
            await registrationData.save();
            res.redirect("/success")
        } else {
            log("user already exist");
            res.redirect("/error");
        }

    } catch (error) {
        console.log(error);
        res.redirect("error")
    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/successful_registration.html");
})

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/registration_failure.html");
})



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})