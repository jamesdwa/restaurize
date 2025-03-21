import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js';
import sessions from 'express-session';
import cors from 'cors';

import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
   auth: {
     clientId: "a3a1daca-29b1-4a2b-ade8-b05b366c35e2",
      authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
      clientSecret: "Wwa8Q~~~bRiChpEQfeXdtMmtTvbXs1XYqycW2dj8",
      redirectUri: "/redirect"
   },
  system: {
      loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
              console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: 3,
      }
  }
};

import pathRouter from './routes/api/v1/apiv1.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.enable('trust proxy')

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

const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
   secret: "my secret is super secret lkadsglkjah",
   saveUninitialized: true,
   cookie: { maxAge: oneDay },
   resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.get('/signin', (req, res, next) => {
   return req.authContext.login({
      postLoginRedirectUri: "/",
   })(req, res, next);

});
app.get('/signout', (req, res, next) => {
   return req.authContext.logout({
      postLogoutRedirectUri: "/",
   })(req, res, next);

});
app.use(authProvider.interactionErrorHandler());

app.use((req, res, next) => {
   req.models = models;
   next();
})

app.use('/api/v1', pathRouter);

export default app;