const express = require("express");
const router = express.Router();

const Posts = require("../data/db");
const Comments = require("../data/db");

router.get("/", (req, res) => {
    Posts.find(req.query)
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: "The posts information could not be retrieved.",
            });
        });
});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id).then((post) => {
        if (post) {
            if (post.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist.",
                });
            } else if (post.length > 0) {
                res.status(200).json(post);
            } else
                res.status(500).json({
                    error: "The post information could not be retrieved.",
                });
        }
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
        Posts.insert(post);
        res.status(201).json(post);
    } else
        res.status(500).json({
            error: "There was an error while saving the post to the database",
        });
});

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    Posts.findById(id).then((post) => {
        if (post.length > 0) {
            res.status(200).json({ Comments });
        } else if (post.length === 0) {
            res.status(404).json({
                message: "The post with the specified ID does not exists.",
            });
        } else
            return res.status(500).json({
                error: "The comments information could not be retrieved.",
            });
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
            } else {
                Comments.insertComment(id, comment);
                res.status(201).json({ comment });
            }
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

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Posts.findById(id).then((post) => {
        if (post.length === 0) {
            res.status(404).json({
                message: "The post with the specified ID does not exist.",
            });
        } else if (post) {
            Posts.remove(id).then(
                res.status(204).json({ message: "Post was deleted" })
            );
        } else
            res.status(500).json({ error: "The post could not be removed." });
    });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;

    Posts.findById(id).then((post) => {
        if (post.length === 0) {
            res.status(404).json({
                message: "The post with the specified ID does not exist.",
            });
        } else if (req.body.title && req.body.contents) {
            req.body.id = id;
            Posts.update(id, req.body).then(res.status(203).json(req.body));
            // post.title = req.body.title;
            // post.contents = req.body.contents;
        } else if (!req.body.title || !req.body.contents) {
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post.",
            });
        } else
            res.status(500).json({
                error: "The post information could not be modified.",
            });
    });
});

module.exports = router;
