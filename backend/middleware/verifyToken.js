import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) {
    return res.status(401).json({ success: false, message: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "unauthorized invalid token" });
    console.log("decoded.userId", decoded.userId);
    req.userId = decoded.user;
    next();
  } catch (error) {
    console.log("Error in verifytoken", error);
    return res.status(501).json({ success: false, message: "server error" });
  }
};
