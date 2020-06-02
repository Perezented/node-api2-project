const express = require("express");
const router = express.Router();

const Posts = require("../data/db");

router.get("/", (req, res) => {
    Posts.find(req.query)
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: "Error getting info from posts",
            });
        });
});

module.exports = router;
