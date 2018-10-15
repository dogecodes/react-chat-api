<p align="center">
    <img src="https://user-images.githubusercontent.com/3459374/36045604-e2de52b6-0dde-11e8-9b44-50bebc7fa82e.png" alt="DogeCodes">
</p>

# Chat API

> API for chat application for DogeCodes React course.

This is a simple API server that implements a logic required to correct work of DogeCodes React Chat application.

## Requirements

To run this server localy you need to have these requirements:

- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/download-center#community)

## Installations

Use following commands to run this API-server localy:

```zsh
git clone https://github.com/dogecodes/react-chat-api.git
cd react-chat-api
npm install
npm run start:dev # or `npm start` for production
```

**Note:** Don't forget to start `mongod` for connection to database.

## API

Current version of API is `v1`, so you need to specify the version of API before every route. For example:

```
http://localhost:8000/v1/users/me
http://localhost:8000/v1/chats
```

### HTTP

Here's the map of API's HTTP routes:

- `/` — routes related to authentication.
  - `/signup` **POST** — create new user with `username` and `password`.
  - `/login` **POST** — log user in with `username` and `password`.
  - `/logout` **GET** — log out active user.
- `/users` — routes related to users.
  - `/users` **GET** — retrieve data about all users.
  - `/users/me` **GET** — retrieve my user's data.
  - `/users/me` **POST** — update my user's information (`username`, `firstName`, `lastName` and `city`).
  - `/users/:id` **GET** — retrieve information about user with specific `:id`.
- `/chats` — routes related to chats.
  - `/chats` **GET** — retrieve information about all chats.
  - `/chats` **POST** — create new chat with specified `title`.
  - `/chats/my` **GET** — get list of all user's chats.
  - `/chats/:id` **GET** — get chat's information with messages by specific chat's `:id`.
  - `/chats/:id` **POST** — send new message to chat with specific `:id`.
  - `/chast/:id` **DELETE** — delete chat with specific `:id`. Only creator of the chat can delete it.
  - `/chats/:id/join` **GET** — join chat with specific `:id`.
  - `/chats/:id/leave` **GET** — leave chat with specific `:id`.

If you're using [Insomnia](https://insomnia.rest/) for debugging APIs, you can download a workspace backup:

[**Download .zip**](https://github.com/dogecodes/react-chat-api/files/1713340/backup.zip)

### Sockets

This API also emmits and listens some [socket.io](https://socket.io/) events.

Sockets connection requires authentication with access-token. Here's an example of establishing sockets connection:

```js
import SocketIOClient from 'socket.io-client';

socket = SocketIOClient('path/to/api', {
  query: {
    token: '...your access-token here...',
  },
});
```

Here's the list of events:

#### Emmiting

- `new-message` — emmited when someone sends new message to specific chat.
- `new-chat` — emmited when someone creates new chat.
- `deleted-chat` — emmited when someone deletes a chat.

#### Listening

- `connection` — connection of socket.io client.
- `mount-chat` — mount a client to listen for messages in chat with specific `:chatId`.
- `unmount-chat` — unmout a client from listening for messages in chat with specific `:chatId`.
- `send-message` — send message with `content` to chat with

## License

MIT © [Denys Dovhan](https://denysdovhan.com)
