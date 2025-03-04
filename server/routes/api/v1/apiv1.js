import express from 'express';
var router = express.Router();

import sendRouter from './controllers/send.js';

router.use('/send', sendRouter);

export default router;