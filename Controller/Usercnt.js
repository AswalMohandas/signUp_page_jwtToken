const User = require("../model/userDataModel.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const SECRET_KEY = process.env.SECRET_KEY;

// ================= SIGNUP =================
const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already exists");
    }

    const SALTROUND = 10;

    // hash password
    const hashedPassword = await bcrypt.hash(password, SALTROUND);

    const newUser = new User({
      name,
      email,
      
      password: hashedPassword
    });

    await newUser.save();

    // 🔐 CREATE JWT TOKEN
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ console token
    console.log("Signup Token:", token);

    // send token in header
    res.setHeader("Authorization", `Bearer ${token}`);
  // ✅ JSON RESPONSE
    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
    res.redirect("/loginpage");

  } catch (error) {
    console.log("Add user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



const loginchecking = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });


    console.log(existingUser);
    
    if (!existingUser) {
      return res.send("User not found");
    }

     const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.render("LoginPage.ejs", {
        message: "Invalid password"
      });
    }
 //  CREATE JWT TOKEN
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
 console.log("Login Token:", token);

    res.render("HomePage.ejs", {
      message: "Login successful"
    });

      // ✅ JSON RESPONSE
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      }
    });
  }  catch (error) {
    console.log("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const homePage=(req,res)=>{
res.render("homePage.ejs"
)
}

const SignPage=(req,res)=>{
res.render("SignUp.ejs"
)
}

const loginPage=(req,res)=>{
    res.render("LoginPage.ejs")
}

module.exports={
    homePage,
     SignPage, 
     loginPage,
     addUser,
  loginchecking
    }