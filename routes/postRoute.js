const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 게시글 작성 API
router.post('/posts', authMiddleware, async(req, res) => {
    try {
        const {title, content} = req.body; // 제목, 내용 입력
        const user = res.locals.user; // 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
        // 제목 미입력
        if (!title) {
            res.status(412).json({
                errorMessage: "게시글 제목의 형식이 일치하지 않습니다."
            });
            return;
        }
        // 내용 미입력
        if (!content) {
            res.status(412).json({
                errorMessage: "게시글 내용의 형식이 일치하지 않습니다."
            });
            return;
        }

        // 게시글 생성
        await Posts.create({
            userId: user.userId,
            nickname: user.nickname,
            title: title,
            content: content,
        });


        res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
    } catch(err) {
        res.status(400).json({
            errorMessage: "게시글 작성에 실패했습니다."
        });
        return;
    }
});

// 게시글 조회 API
router.get("/posts", async(req, res) => {
    try {
        const posts = await Posts.findAll({
            attributes: ["postId", "userId", "nickname", "title", "createdAt", "updatedAt"],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ posts });
    } catch(err) {
        res.status(400).json({
            errorMessage: "게시글 조회에 실패했습니다."
        });
        return;
    }
});

// 게시글 상세 조회 API
router.get("/posts/:postId", async(req, res) => {
    try {
        const { postId } = req.params;
        const posts = await Posts.findOne({
            attributes: ["postId", "userId", "nickname", "title", "createdAt", "updatedAt"],
            where: { postId }
        });

        res.status(200).json({ posts });
    } catch(err) {
        res.status(400).json({
            errorMessage: "게시글 조회에 실패했습니다."
        });
        return;
    }
});

// 게시글 수정 API
router.put("/posts/:postId", authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;
        const user = res.locals.user; // 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
        // 게시글을 조회합니다.
        const updateData = await Posts.findOne({ where: { postId } });
        console.log(updateData.nickname, user.nickname);
        // 데이터 형식이 올바르지 않음
        if (!updateData) {
            res.status(412).json({
                errorMessage: "데이터 형식이 올바르지 않습니다."
            });
            return;
        }
        // 제목 미입력
        if (!title) {
            res.status(412).json({
                errorMessage: "게시글 제목의 형식이 일치하지 않습니다."
            });
            return;
        }
        // 내용 미입력
        if (!content) {
            res.status(412).json({
                errorMessage: "게시글 내용의 형식이 일치하지 않습니다."
            });
            return;
        }
        // 로그인한 회원의 닉네임과 해당 게시글 작성한 닉네임이 다른 경우
        if (updateData.nickname !== user.nickname)  {
            res.status(403).json({
                errorMessage: "게시글 수정의 권한이 존재하지 않습니다."
            });
            return;
        }
        // 게시글의 권한을 확인하고, 게시글을 수정합니다.
        await Posts.update(
            { title, content }, // title과 content 컬럼을 수정합니다.
            { where: { postId } }
        );
        // 게시글 수정
        if (updateData) {
            res.status(200).json({ message: "게시글을 수정하였습니다." });
            return;
        } else {
            res.status(401).json({ errorMessage: "게시글이 정상적으로 수정되지 않았습니다." });
            return;
        }
    } catch(err) {
        res.status(400).json({
            errorMessage: "게시글 수정에 실패했습니다."
        });
        return;
    }
});

// 게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params;
        const user = res.locals.user; // 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
        // 게시글을 조회합니다.
        const deleteData = await Posts.findOne({ where: { postId } });
        // 게시글이 존재하지 않는 경우
        if (!deleteData) {
            res.status(404).json({
                errorMessage: "게시글이 존재하지 않습니다."
            });
            return;
        }
        // 로그인한 회원의 닉네임과 해당 게시글 작성한 닉네임이 다른 경우
        if (deleteData.nickname !== user.nickname)  {
            res.status(403).json({
                errorMessage: "게시글 삭제의 권한이 존재하지 않습니다."
            });
            return;
        }
        // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
        await Posts.destroy(
            { where: { postId } }
        );
        // 게시글 삭제
        if (deleteData) {
            res.status(200).json({ message: "게시글을 삭제하였습니다." });
            return;
        } else {
            res.status(401).json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." });
            return;
        }
    } catch(err) {
        res.status(400).json({
            errorMessage: "게시글 삭제에 실패했습니다."
        });
        return;
    }
});


module.exports = router;