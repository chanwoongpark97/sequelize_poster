const express = require("express");
const globalRouter = require("./routes/indexRoute.js");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3003;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [globalRouter]);

app.get('/', (req, res) => {
    res.send('안녕하세요. sequelize 게시판 프로젝트 입니다.');
});

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 열렸어요!');
});