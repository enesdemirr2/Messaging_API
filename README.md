# RestFullApi



## Database Structure

<img src="https://i.hizliresim.com/qr3ut2w.png" width="50%">

## Routes

| Command | Description |
| --- | --- |
| `/api/register` | register page |
| `/api/register-post` | register |
| `/api/login` | login page |
| `/api/login-post` | login |
| `/api/logout` | logout |
| `/api/check-auth` | check auth status |
| `/api/send-message` | message page |
| `/api/get-message` | see all messages (chats) from other users |
| `/api/messages-content/:username` | see all messages between a user |
| `/api/delete-message/:message_id` | delete message |
| `/api/send-message-to/:username` | send message to user |
| `/api/block-user/:username` |  block a user |
| `/api/unblock-user/:username` |  unblock a user |
| `/api/is-it-blocked/:username` |  check user is blocked |
| `/api/blocked-list` | get all blocked user (only blocked from you) |

## Installation

```
npm i
```
## Migrating

```
sequelize db:migrate
```
## Database Config

```
config.json

"development": {
    "username": "root",
    "password": null,
    "database": "***database_name***",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
```


> **NOT:** Due to api incompatibility of Passport.js, "login" and "logout" responses may be "Cannot GET /login". The routes work fine, although the answers are problematic.
