const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
    try {
    const { Authorization } = req.cookies;
    const [tokenType, token] = (Authorization ?? "").split(" ");
    if (tokenType !== "Bearer" || !token) {
      return res.status(403).json({ errorMessage: "로그인 후 이용 가능합니다." });
    }

      const { userId } = jwt.verify(token, "customized-secret-key");

      const user = await Users.findOne({ userId });
      res.locals.user = user;
      next();

    } catch (error) {
      return res.status(403).json({
        errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."
      });
    }
}