const Post = require("../models/Post");
const User = require("../models/User");

const postController = {};

postController.createPost = async (req, res, next) => {
  try {
    const { author_id, title, content } = JSON.parse(req.body);

    const post = await Post.create({
      author_id,
      title,
      content,
    });
    res.send(post);
  } catch (err) {
    return next(err);
  }
};

postController.getPosts = async (req, res, next) => {
  if (req.params.id) {
    const { id } = req.params;
    User.findById(id)
      .populate("posts")
      .exec((err, posts) => {
        if (err) return next(err);
        res.send(posts);
      });
  } else {
    Post.find({})
      .populate("comments")
      .populate({ path: "author_id", select: ["username", "avatar"] })
      .exec((err, posts) => {
        if (err) return next(err);
        res.send(posts);
      });
  }
};

postController.getPostsByPostID = async (req, res, next) => {
  const { post_id } = req.params;
  Post.findById(post_id)
    .populate("comments")
    .then((data) => res.send(data))
    .catch((err) => {
      return next(err);
    });
};

postController.deletePost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { author_id } = JSON.parse(req.body);
    await Post.findOneAndDelete({ _id: post_id, author_id });
    res.status(200).send("deleted!");
  } catch (err) {
    return next(err);
  }
};

module.exports = postController;
