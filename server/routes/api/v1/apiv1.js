import express from 'express';
var router = express.Router();

import sendRouter from './controllers/post.js';

router.use('/post', sendRouter);

export default router;