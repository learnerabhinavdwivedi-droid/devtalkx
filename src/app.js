import express from "express";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/requests.js";
import userRouter from "./routes/user.js";
import cors from "cors";
import dotenv from "dotenv";
import "./utils/cronjob.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB()
  .then(() => {
    app.listen(8080, () => {
      console.log("SERVER IS LISTENING TO PORT: 8080");
    });
  })
  .catch((e) => {
    console.log(e);
  });

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// app.post("/api/user/new", async (req, res) => {
//   try {
//     // validateNewUser(req);
//     const {
//       firstName,
//       lastName,
//       emailId,
//       password,
//       age,
//       gender,
//       phoneNumber,
//       skills,
//       photoURL,
//     } = req.body;

//     const passwordHash = await bcrypt.hash(password, 10);
//     // console.log(passwordHash);

//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       age,
//       gender,
//       skills,
//       photoURL,
//       phoneNumber,
//       password: passwordHash,
//     });

//     await user.save();

//     res.json({
//       success: true,
//       message: "data created successfully",
//     });
//   } catch (e) {
//     res.status(e.code || 400).json({
//       success: false,
//       message: "something went wrong",
//       error: e.message,
//       errorCode: e.code || 400,
//     });
//   }
// });

app.get("/api/get/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      success: true,
      message: "data fetched successfully",
      data: users,
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/get/user/email", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length > 0) {
      res.json({
        success: true,
        message: "find successfull",
        data: user,
      });
    } else {
      throw new Error("user not found");
    }
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
});

app.get("/api/get/one/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (user) {
      res.json({
        success: true,
        message: "data fetched successfully",
        data: user,
      });
    } else {
      throw new Error("error");
    }
  } catch (e) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.get("/api/get/user/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const user = await User.findById(_id);
    res.json({
      success: true,
      message: "success",
      data: user,
    });
  } catch (e) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.delete("/api/delete/user/:_id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params._id);
    if (user) {
      res.json({
        success: true,
        message: "user deletion successfull",
      });
    } else {
      throw new Error("no user found");
    }
  } catch (e) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.patch("/api/update/user/:_id", async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoURL",
      "about",
      "skills",
      "phoneNumber",
    ];

    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("updation not possible");
    }

    const user = await User.findByIdAndUpdate(req.params._id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (user) {
      res.json({
        success: true,
        message: "user updation successful",
      });
    } else {
      throw new Error("something went wrong");
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message || "something went wrong",
      error: e || "no error found",
    });
  }
});

app.patch("/api/update/user", async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    const user = await User.findOneAndUpdate(
      { emailId: email },
      {
        firstName,
        lastName,
      }
    );
    if (user) {
      res.json({
        success: true,
        message: "user updated successfully",
      });
    } else {
      throw new Error("user not found");
    }
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "something went wrong",
      error: error,
    });
  }
});

app.delete("/api/delete/user", async (req, res) => {
  try {
    const user = await User.deleteOne({ emailId: req.body?.emailId });

    if (user.deletedCount > 0) {
      res.json({
        success: true,
        message: "user deletion successful",
      });
    } else {
      throw new Error("something went wrong");
    }
  } catch (e) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.delete("/api/delete/users", async (req, res) => {
  try {
    const user = await User.deleteMany({ emailId: req.body?.emailId });

    if (user.deletedCount > 0) {
      res.json({
        success: true,
        message: "user deletion successful",
      });
    } else {
      throw new Error("something went wrong");
    }
  } catch (e) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.get("/api/exists/user", async (req, res) => {
  try {
    const user = await User.exists({ emailId: req.body?.emailId });
    console.log(user);

    if (user) {
      res.json({
        success: true,
        message: "user exists",
        data: user,
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
});

// app.post("/api/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     if (!validator.isEmail(emailId)) {
//       throw new Error("invalid credentials");
//     }

//     const user = await User.findOne({ emailId: emailId });

//     if (!user) {
//       throw new Error("user not found");
//     }

//     const isPasswordValid = user.validatePassword(password);

//     if (!isPasswordValid) {
//       throw new Error("invalid credentials");
//     }

//     const token = await user.getJWT();

//     res.cookie("token", token);

//     res.json({
//       success: true,
//       message: "login successful",
//       token: token,
//     });
//   } catch (e) {
//     res.json({
//       success: false,
//       message: e.message || "something went wrong",
//     });
//   }
// });

// app.get("/api/profile", userAuth, async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       message: "everything fine",
//       user: req.user,
//     });
//   } catch (e) {
//     res.json({
//       success: false,
//       message: "something went wrong",
//       error: e.message,
//     });
//   }
// });

// app.post("/api/send-connection-request", userAuth, async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       message: "sending connection request",
//     });
//   } catch (e) {
//     res.json({
//       success: false,
//       message: "something went wrong",
//       error: e.message,
//     });
//   }
// });