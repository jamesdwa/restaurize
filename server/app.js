import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

/* Allows all domains to access the server's resources. */
/* If we want to limit the domains that can access the server's
   resources, we create a courseOptions variable and assign its
   origin property a domain we want to specifically accept
   requests from. */
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

import pathRouter from './routes/api/v1/apiv1.js'
import models from './models.js';

app.use((req, res, next) => {
   req.models = models;
   next();
})

app.use('/api/v1', pathRouter);

export default app;
