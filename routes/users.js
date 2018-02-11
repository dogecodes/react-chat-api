const { Router } = require('express');
const usersController = require('../controllers/users');

const usersRouter = new Router();

usersRouter.get('/', (req, res, next) => {
  usersController
    .getAllUsers(req.decoded.userId)
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        users: result.users,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
      next();
    });
});

usersRouter.get('/me', (req, res, next) => {
  usersController
    .getUserById(req.decoded.userId)
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        user: result.user,
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

usersRouter.get('/:id', (req, res, next) => {
  usersController
    .getUserById(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        message: result.message,
        user: result.user,
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

usersRouter.post('/me', (req, res, next) => {
  usersController
    .editUser(req.decoded.userId, req.body.data)
    .then((result) => {
      res.json({
        success: true,
        message: result.message,
        user: result.user,
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

module.exports = usersRouter;
