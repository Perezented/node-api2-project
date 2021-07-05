const express = require("express");

const server = express();
server.use(express.json());
server.get("/", (req, res) => {
    res.status(200).json({
        Message: "success on getting to the main slash",
    });
});

const postsRouter = require("./posts/posts");
server.use("/api/posts", postsRouter);

server.listen(9000, () => {
    console.log("\n*** server is listening on port 9000 ***\n");
});
