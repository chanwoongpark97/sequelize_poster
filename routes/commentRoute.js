const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 댓글 작성 API
router.post('/posts/:postId/comments', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body; // 댓글 입력
        const { userId, nickname } = res.locals.user; // 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능

        // 게시글 미존재
        if (!postId) {
            res.status(404).json({
                errorMessage: "게시글이 존재하지 않습니다"
            });
            return;
        }
        // 댓글 미입력
        if (!comment) {
            res.status(412).json({
                errorMessage: "댓글 내용의 형식이 일치하지 않습니다."
            });
            return;
        }

        // 댓글 생성
        await Comments.create({
            postId: postId,
            userId: userId,
            nickname: nickname,
            comment : comment,
        });

        res.status(201).json({ message: "댓글 작성에 성공하였습니다." });
    } catch(err) {
        res.status(400).json({
            errorMessage: "댓글 작성에 실패했습니다."
        });
        return;
    }
});

// 댓글 조회 API
router.get("/posts/:postId/comments", async(req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comments.findAll({
            attributes: ["commentId", "userId", "nickname", "comment", "createdAt", "updatedAt"],
            where : [{ postId: postId }], // 해당 게시글 조회
            order: [['createdAt', 'DESC']], // 댓글 작성 날짜 기준으로 내림차순
        });

        res.status(200).json({ comments });
    } catch(err) {
        res.status(400).json({
            errorMessage: "게시글 조회에 실패했습니다."
        });
        return;
    }
});

// 댓글 수정 API
router.put("/posts/:postId/comments/:commentId", authMiddleware, async(req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { comment } = req.body; // 댓글 입력
        const { userId } = res.locals.user; // 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 수정 가능
        // 게시글을 조회합니다.
        const updateData = await Comments.findOne({ where: { commentId } });
        // 게시글이 존재하지 않는 경우
        if (!postId) {
            res.status(412).json({
                errorMessage: "게시글이 존재하지 않습니다."
            });
            return;
        }
        // 댓글이 존재하지 않는 경우
        if (!updateData) {
            res.status(412).json({
                errorMessage: "댓글이 존재하지 않습니다."
            });
            return;
        }
        // 댓글 미입력
        if (!comment) {
            res.status(412).json({
                errorMessage: "댓글 형식이 일치하지 않습니다."
            });
            return;
        }
        // 로그인한 회원의 유저 아이디와 댓글 작성한 회원 아이디가 다른 경우
        if (updateData.userId !== userId)  {
            res.status(403).json({
                errorMessage: "댓글 수정의 권한이 존재하지 않습니다."
            });
            return;
        }
        // 댓글의 권한을 확인하고, 댓글을 수정합니다.
        await Comments.update(
            { comment }, // comment 컬럼을 수정합니다.
            { where: { commentId, userId: userId } }
        );
        // 댓글 수정
        if (updateData) {
            res.status(200).json({ message: "댓글을 수정하였습니다." });
            return;
        } else {
            res.status(401).json({ errorMessage: "댓글이 정상적으로 수정되지 않았습니다." });
            return;
        }
    } catch(err) {
        res.status(400).json({
            errorMessage: "댓글 수정에 실패했습니다."
        });
        return;
    }
});

// 댓글 삭제 API
router.delete("/posts/:postId/comments/:commentId", authMiddleware, async(req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user; // 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 삭제 가능
        // 댓글을 조회합니다.
        const deleteData = await Comments.findOne({ where: { commentId } });
        // 게시글이 존재하지 않는 경우
        if (!postId) {
            res.status(404).json({
                errorMessage: "게시글이 존재하지 않습니다."
            });
            return;
        }
        // 댓글이 존재하지 않는 경우
        if (!deleteData) {
            res.status(404).json({
                errorMessage: "댓글이 존재하지 않습니다."
            });
            return;
        }
        // 로그인한 회원의 유저 아이디와 댓글 작성한 회원 아이디가 다른 경우
        if (deleteData.userId !== userId)  {
            res.status(403).json({
                errorMessage: "댓글 삭제의 권한이 존재하지 않습니다."
            });
            return;
        }
        // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
        await Comments.destroy(
            { where: { commentId, userId: userId } }
        );
        // 게시글 삭제
        if (deleteData) {
            res.status(200).json({ message: "댓글을 삭제하였습니다." });
            return;
        } else {
            res.status(401).json({ errorMessage: "댓글이 정상적으로 삭제되지 않았습니다." });
            return;
        }
    } catch(err) {
        res.status(400).json({
            errorMessage: "댓글 삭제에 실패했습니다."
        });
        return;
    }
});


module.exports = router;