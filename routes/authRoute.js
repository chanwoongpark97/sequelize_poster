const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

// 로그인 API
router.post("/", async (req, res) => {
    try {
        const { nickname, password } = req.body;

        // 닉네임이 일치하는 유저를 찾는다.
        const user = await Users.findOne({ where: { nickname: nickname } });
        console.log(user.userId);

        // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
        // 1. 이메일에 일치하는 유저가 존재하지 않거나
        // 2. 유저를 찾았지만, 유저의 비밀번호와, 입력한 비밀번호가 다를때,
        if (!user || password !== user.password) {
            res.status(412).json({
                errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
            });
            return;
        }

        // JWT를 생성
        const token = jwt.sign({ userId: user.userId }, "customized-secret-key");
    
        res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
        res.status(200).json({ token }); // JWT를 Body로 할당합니다!
    } catch {
        res.status(400).json({ 
            errorMessage: "로그인에 실패하였습니다." 
        });
        return;
    }
});

module.exports = router;