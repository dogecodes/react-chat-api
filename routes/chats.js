const { Router } = require('express');
const chatsController = require('../controllers/chats');
const messagesController = require('../controllers/messages');

const chatsRouter = new Router();

chatsRouter.get('/', (req, res, next) => {
  chatsController.getAllChats()
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        chats: result.chats,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
    });
});

chatsRouter.post('/new', (req, res, next) => {
  chatsController.newChat(req.decoded.userId, req.body.data)
    .then((result) => {
      // send socket about new chat
      // wss.broadcast({
      //   type: 'newChat',
      //   success: true,
      //   chat: result.chat
      // });
      res.json({
        success: result.success,
        message: result.message,
        chat: result.chat,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
    });
});

chatsRouter.get('/:id', (req, res, next) => {
  // Current implementation is a bit shity, don't blame me.
  Promise.all([
    chatsController.getChat(req.decoded.userId, req.params.id),
    messagesController.getAllMessages(req.params.id)
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
    });
});

chatsRouter.post('/:id/send', (req, res, next) => {
  messagesController.sendMessage(req.decoded.userId, req.params.id, req.body.data)
    .then(({ success, message}) => {
      // send socket to all members and creator

      res.json({
        success,
        message,
      })
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
    });
});

chatsRouter.delete('/:id/delete', (req, res, next) => {
  chatsController.deleteChat(req.decoded.userId, req.params.id)
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        chats: result.chats,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
    });
});

module.exports = chatsRouter;
