const express = require("express");
const postsRouter = require("./postRoute.js");
const usersRouter = require("./userRoute.js");
const authRouter = require("./authRoute.js");
const commentsRouter = require("./commentRoute.js")
const likesRouter = require("./likeRoute.js")

const router = express.Router();

router.use('/', [postsRouter, commentsRouter, likesRouter]);
router.use('/signup', [usersRouter]);
router.use('/login', [authRouter]);
// router.use('/comments', commentsRouter);

module.exports = router;