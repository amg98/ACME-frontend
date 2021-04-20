/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const express = require("express");
const path = require("path");
const app = express();

const STATIC = path.resolve(__dirname, "..", "dist/acme-frontend");
const INDEX = path.resolve(STATIC, "index.html");

app.use(express.static(STATIC));

app.get("*", (req, res) => {
    res.sendFile(INDEX);
});

app.listen(process.env.PORT, () => {
    console.log(`Running at port ${process.env.PORT}`);
});
