const { Router } = require('express');
const authConroller = require('../controllers/auth');

const authRouter = new Router();

authRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  authConroller
    .signUp(username, password)
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        exists: result.exists,
        user: result.user,
        token: result.token,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
      next(error);
    });
});

authRouter.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  authConroller
    .login(username, password)
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        notExists: result.notExists,
        user: result.user,
        token: result.token,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
      next(error);
    });
});

authRouter.get('/logout', (req, res, next) => {
  authConroller
    .logout()
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
      next(error);
    });
});

module.exports = authRouter;
