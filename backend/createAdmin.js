// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const User = require("./models/User"); 
// require("dotenv").config();

// // 
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// // 
// async function createAdmin() {
//   try {
//     const email = "p@gmail.com.com";

//     // Check if admin already exists
//     const existing = await User.findOne({ email });

//     if (existing) {
//       console.log("Admin already exists!");
//       process.exit();
//     }

//     const hashedPassword = await bcrypt.hash("123", 10);

//     await User.create({
//       name: "Priyanjal",
//       email: email,
//       password: hashedPassword,
//       role: "admin",
//     });

//     console.log(" Admin Created Successfully!");
//     process.exit();
//   } catch (err) {
//     console.log(err);
//     process.exit();
//   }
// }

// createAdmin();
