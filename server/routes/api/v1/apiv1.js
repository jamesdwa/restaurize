import express from 'express';
var router = express.Router();

import sendRouter from './controllers/post.js';
import usersRouter from './controllers/users.js'

console.log("here");
router.use('/post', sendRouter);
router.use('/users', usersRouter);


export default router;