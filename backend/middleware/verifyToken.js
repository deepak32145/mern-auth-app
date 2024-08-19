import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) {
    return res.status(401).json({ success: false, message: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "unauthorized invalid token" });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifytoken", error);
    return res.status(501).json({ success: false, message: "server error" });
  }
};
