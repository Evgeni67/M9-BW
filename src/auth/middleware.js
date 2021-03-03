const jwt = require("jsonwebtoken");
const UserModel = require("../services/users/schema");
const { verifyJWT } = require("./tools");

const authorize = async (req, res, next) => {
  try {
    console.log(req.headers)
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token);
    const decoded = await verifyJWT(token);
    console.log("working->");
    console.log("THIS IS THE DECODED ID =>", decoded);
    console.log("<-working");
      const user = await UserModel.findOne({
        _id: decoded._id,
      });
   

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    const err = new Error("Please authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else {
    const err = new Error("Only for admins!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = { authorize, adminOnlyMiddleware };
