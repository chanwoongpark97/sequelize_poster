const express = require("express");
const { Op } = require('sequelize');

const { Likes, Posts, sequelize, Users } = require('../models');
const authMiddleware = require("../middlewares/auth-middleware.js");

const router = express.Router();

// 게시글 좋아요 업데이트 API
router.put('/:postId/like', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user; // 토큰을 검사하여 해당 회원 확인
  
        const isExistPost = await Posts.findByPk(postId); // 게시글 있는지 확인
        // 게시글 없을 때
        if (!isExistPost) {
        return res.status(404).json({
            errorMessage: '게시글이 존재하지 않습니다.',
            });
        }
        // postId와 userId 검색
        let isLike = await Likes.findOne({
            where: {
                postId: postId,
                userId: userId,
            },
        });
        // 좋아요 유무 따져서 좋아요가 없으면 좋아요 등록, 반대인 경우는 좋아요 취소
        if (!isLike) {
            await Likes.create({ postId: postId, userId: userId });
  
            return res.status(200).json({ message: '게시글의 좋아요를 등록하였습니다.' });
        } else {
            await Likes.destroy({
                where: { postId: postId, userId: userId },
            });
  
            return res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다.' });
        }
    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            errorMessage: '게시글 좋아요에 실패하였습니다.',
        });
    }
});

// 좋아요 조회 API
router.get('/like', authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user; // 토큰을 검사하여 해당 회원 확인
  
        const parseLikePostsModel = (likes) => {
            return likes.map((like) => {
                let obj = {};
  
            for (const [k, v] of Object.entries(like)) {
                if (k.split('.').length > 1) {
                    const key = k.split('.')[1];
                    obj[key] = v;
                } else obj[k] = v;
            }
                return obj;
            })
        }
        // 좋아요 조회에 넣을 컬럼들 추가
        const posts = await Posts.findAll({
            attributes: [
                'postId',
                'title',
                'createdAt',
                'updatedAt',
                [sequelize.fn('COUNT', sequelize.col('Likes.postId')), 'likes'], // 좋아요 갯수
            ],
            include: [
                {
                    model: Users,
                    attributes: ['userId', 'nickname'],
                }, // 유저 테이블의 userId와 nickname 포함
                {
                    model: Likes,
                    attributes: [],
                    required: true,
                    where: {
                        [Op.and]: [{ userId: userId }],
                    }, // 라이크 테이블의 userId 포함
                },
            ],
            group: ['Posts.postId'], // 해당 게시글 기준으로 Group by
            order: [['createdAt', 'DESC']], // 게시글 생성 날짜 기준으로 내림차순
            raw: true,
        }).then((likes) => parseLikePostsModel(likes));
  
        return res.status(200).json({ posts: posts }); // posts 조회
        } catch (error) {
            console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
            return res.status(400).json({
            errorMessage: '좋아요 게시글 조회에 실패하였습니다.',
        });
    }
});

module.exports = router;