const express = require("express");
const router = express.Router();
const { Users } = require("../models");

// 회원가입 API
router.post("/", async (req, res) => {
    try {
        const { nickname, password, confirm } = req.body;
        // 닉네임 형식이 올바르지 않을 때(a~z,A~Z,0~9만 포함되지 않고, 최소 3글자 이상이 아닐때)
        if (!nickname.match(/^[a-zA-Z0-9]{3,}$/)) {
            res.status(412).json({ 
                errorMessage: "닉네임의 형식이 일치하지 않습니다." 
            });
            return;
        }
        
        // 패스워드와 패스워드 확인이 불일치 할때
        if (password !== confirm) {
            res.status(412).json({
                errorMessage: "패스워드가 일치하지 않습니다."
            });
            return;
        }

        // 패스워드 길이가 4글자 미만일때
        if (password.length < 4) {
            res.status(412).json({ 
                errorMessage: "패스워드 형식이 일치하지 않습니다."
            });
            return;
        }

        // 패스워드가 닉네임이랑 포함된게 있을때
        if (password.includes(nickname)) {
            res.status(412).json({ 
                "errorMessage": "패스워드에 닉네임이 포함되어 있습니다." 
            });
            return;
        }

        // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
        const existsUsers = await Users.findOne({ where : {nickname : nickname}}); // mysql은 where절을 사용해야함
        // 이미 해당 닉네임이 등록 되었을 때
        if (existsUsers) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
            res.status(412).json({
            errorMessage: "중복된 닉네임입니다.",
            });
            return;
        }

        const user = new Users({ nickname, password });
        await user.save();

        res.status(201).json({});
    } catch (err) {
        res.status(400).json({ 
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다." 
        });
        return;
    }    
});

module.exports = router;