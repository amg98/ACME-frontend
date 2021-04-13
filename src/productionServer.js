const express = require("express");
const path = require("path");
const app = express();

const STATIC = path.resolve(__dirname, "..", "dist");
const INDEX = path.resolve(STATIC, "index.html");

app.use(express.static(STATIC));

app.get("*", (req, res) => {
    res.sendFile(INDEX);
});

app.listen(process.env.PORT, () => {
    console.log(`Running at port ${process.env.PORT}`);
});
