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
    const post = req.body;
    if (!post.title || !post.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post.",
        });
    } else if (post.title && post.contents) {
        post.id = Date.now();
        res.status(201).json(post);
    } else
        res.status(500).json({
            error: "There was an error while saving the post to the database",
        });
});

router.post("/:id/comments", (req, res) => {
    const id = req.params.id;

    const comment = req.body;
    comment.post_id = id;
    Posts.findById(id).then((post) => {
        if (post.length > 0) {
            if (!comment.text) {
                res.status(400).json({
                    errorMessage: "Please provide text for the comment.",
                });
            } else res.status(201).json({ comment });
        } else if (post.length === 0) {
            res.status(404).json({
                message: "The post with the specified ID does not exist.",
            });
        } else
            res.status(500).json({
                error: "The posts information could not be retrieved.",
            });
    });
});

module.exports = router;
