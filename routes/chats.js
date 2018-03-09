const { Router } = require('express');
const chatsController = require('../controllers/chats');
const messagesController = require('../controllers/messages');

const chatsRouter = new Router();

chatsRouter.get('/', (req, res, next) => {
  chatsController
    .getAllChats()
    .then((result) => {
      res.json({
        success: result.success,
        chats: result.chats,
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

chatsRouter.post('/', (req, res, next) => {
  chatsController
    .newChat(req.decoded.userId, req.body.data)
    .then(({ success, message, chat }) => {
      res.io.emit('new-chat', {
        success,
        message,
        chat,
      });
      res.json({
        success,
        message,
        chat,
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

chatsRouter.get('/my', (req, res, next) => {
  chatsController
    .getMyChats(req.decoded.userId)
    .then(({ success, chats }) => {
      res.json({
        success,
        chats,
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

chatsRouter.get('/:id', (req, res, next) => {
  // Current implementation is a bit shity, don't blame me.
  Promise.all([
    chatsController.getChat(req.decoded.userId, req.params.id),
    messagesController.getAllMessages(req.params.id),
  ])
    .then(([chatResponse, messagesResponse]) => {
      res.json({
        success: chatResponse.success && messagesResponse.success,
        chat: Object.assign({}, chatResponse.chat, {
          messages: messagesResponse.messages,
        }),
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

chatsRouter.post('/:id', (req, res, next) => {
  messagesController
    .sendMessage(req.decoded.userId, req.params.id, req.body.data)
    .then(({ success, message }) => {
      // send socket to all members of chat and creator
      res.io.to(req.params.id).emit('new-message', {
        success,
        message,
      });
      res.json({
        success,
        message,
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

chatsRouter.get('/:id/join', (req, res, next) => {
  chatsController
    .joinChat(req.decoded.userId, req.params.id)
    .then(({ success, chat, message }) => {
      res.io.to(req.params.id).emit('new-message', {
        success,
        message,
        chat,
      });
      res.json({
        success,
        message,
        chat,
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

chatsRouter.get('/:id/leave', (req, res, next) => {
  chatsController
    .leaveChat(req.decoded.userId, req.params.id)
    .then(({ success, chat, message }) => {
      res.io.to(req.params.id).emit('new-message', {
        success,
        message,
        chat,
      });
      res.json({
        success,
        message,
        chat,
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

chatsRouter.delete('/:id', (req, res, next) => {
  chatsController
    .deleteChat(req.decoded.userId, req.params.id)
    .then(({ success, message }) => {
      res.io.emit('deleted-chat', {
        success,
        message,
        chat: {
          _id: req.params.id,
        },
      });
      res.json({
        success,
        message,
        chat: {
          _id: req.params.id,
        },
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

module.exports = chatsRouter;
