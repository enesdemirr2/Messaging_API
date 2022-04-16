const router = require('express').Router();
const { login, loginPost, logout, register, registerPost } = require('../controllers/auth_controller');
const {sendMessage, sendMessages, getMessages, messagesContent, blockUser, isItBlocked, unblockUser, blockedList, deleteMessage} = require('../controllers/message_controller');



const { body, checkSchema, validationResult} = require('express-validator');

const {registerValidate, passwordValidate, loginValidate} = require('../middlewares/validation_middleware');
const {checkAuth} = require('../middlewares/checkAuth');
const { Router } = require('express');
const check_auth = require('../controllers/check_auth_controller');

router.get('/api/login', checkAuth, login);
router.post('/api/login-post', checkAuth, loginPost);

router.post('/api/logout', checkAuth, logout);

router.post('/api/check-auth', check_auth)

router.get('/api/register', checkAuth, register);
router.post('/api/register-post', [checkSchema(registerValidate), checkAuth,], registerPost)

router.get('/api/send-message', sendMessage);
router.post('/api/send-message-to/:username', sendMessages)

router.get('/api/get-message', getMessages);
router.get('/api/messages-content/:username', messagesContent);

router.get('/api/block-user/:username', blockUser);
router.get('/api/is-it-blocked/:username', isItBlocked);
router.get('/api/unblock-user/:username', unblockUser);
router.get('/api/blocked-list', blockedList);

router.get('/api/delete-message/:id', deleteMessage);

module.exports = router;