const User = require("../users/users-model");

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(
    `[${new Date().toISOString()}] there was a ${req.method} to ${
      req.url
    } from ${req.get("Origin")}`
  );
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (id) {
      req.user = user;
      next();
    } else {
      next({ message: "user not found", status: 404 });
    }
  } catch (err) {
    next({ error: err, message: err.message, status: 500 });
  }
}

async function validateUser(req, res, next) {
  // DO YOUR MAGIC
  try {
    if (req.body && Object.keys(req.body).length === 0) {
      next({ message: "missing user data", status: 400 });
    } else if (!req.body.name) {
      next({ message: "missing required name field", status: 400 });
    } else {
      next();
    }
  } catch (err) {
    next({ message: err.message, status: 500 });
  }
}

async function validatePost(req, res, next) {
  // DO YOUR MAGIC
  try {
    if (req.body && Object.keys(req.body).length === 0) {
      next({ message: "missing post data", status: 400 });
    } else if (!req.body.text) {
      next({ message: "missing required text field", status: 400 });
    } else {
      next();
    }
  } catch (err) {
    next({ message: err.message, status: 500 });
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  validatePost,
  validateUser,
  validateUserId,
  logger,
};
