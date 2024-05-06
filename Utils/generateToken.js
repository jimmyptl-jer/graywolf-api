import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("access_token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000
  });
};

export default generateTokenAndSetCookie;