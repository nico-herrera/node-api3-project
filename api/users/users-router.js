const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const Middleware = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await Users.get();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", Middleware.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post("/", Middleware.validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next({ error: err, message: err.message, status: 500 });
  }
});

router.put(
  "/:id",
  Middleware.validateUserId,
  Middleware.validateUser,
  async (req, res, next) => {
    // RETURN THE FRESHLY UPDATED USER OBJECT
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
    try {
      const changes = req.body;
      const { id } = req.params;
      const updatedUser = await Users.update(id, changes);
      res.status(200).json(changes);
    } catch (err) {
      next({ error: err, message: err.message, status: 500 });
    }
  }
);

router.delete("/:id", Middleware.validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const { id } = req.params;
    const removedId = await Users.remove(id);
    res.status(200).json({ message: "User was removed from database" });
  } catch (err) {
    next({ error: err, message: err.message, status: 500 });
  }
});

router.get("/:id/posts", Middleware.validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const { id } = req.params;
    const usersPosts = await Users.getUserPosts(id);
    res.status(200).json(usersPosts);
  } catch (err) {
    next({ error: err, message: err.message, status: 500 });
  }
});

router.post(
  "/:id/posts",
  Middleware.validateUserId,
  Middleware.validatePost,
  async (req, res, next) => {
    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
    console.log("here", req.body);
    try {
      const newPost = await Posts.insert({
        text: req.body.text,
        user_id: req.user.id,
      });

      res.status(201).json(newPost);
    } catch (err) {
      next({ error: err, message: err.message, status: 500 });
    }
  }
);

// do not forget to export the router
module.exports = router;
