import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import { Voiceflow } from './voiceflow';

// load in environment variables from .env file
dotenv.config();

const voiceflow = new Voiceflow();

// Create Express server
const app = express();

// Express configuration
app.use(express.static('static'));
app.set('port', 4000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.get('/', (_, res) => res.sendFile(path.join(`${__dirname}/index.html`)));

app.post('/start', (request, response) => {
    voiceflow.start(() => {
        response.send(voiceflow.getMessages());
    }, request.body.userID);
});

app.post('/message', (request, response) => {
    voiceflow.message(() => {
        response.send(voiceflow.getMessages());
    }, request.body.userID, request.body.message);
});

export default app;
