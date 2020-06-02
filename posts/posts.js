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

router.post("/", (req, res) => {
    const item = req.body;
    if (!item.title || !item.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post.",
        });
    } else if (item.title && item.contents) {
        item.id = Date.now();
        res.status(201).json(item);
    } else
        res.status(500).json({
            error: "There was an error while saving the post to the database",
        });
});

router.post("/:id/comments", (req, res) => {
    const id = req.params.id;

    const item = req.body;
    item.post_id = id;
    Posts.findById(id).then((post) => {
        if (post.length > 0) {
            res.status(200).json(post);
        } else if (post.length === 0) {
            res.status(404).json({ message: "notFound" });
        }
    });
});

module.exports = router;
