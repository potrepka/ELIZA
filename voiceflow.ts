import axios from 'axios';

const api = require('./api.json');

export class Voiceflow {
    url: string;
    key: string;
    messages: string[];

    constructor() {
        this.url = 'https://general-runtime.voiceflow.com/interact/' +
                api.versionID;
        this.key = api.key;
        this.messages = [];
    }

    start(success: () => void, userID: string) {
        this.process(success, userID, '');
    }

    message(success: () => void, userID: string, message: string) {
        this.process(success, userID, message);
    }

    process(success: () => void, userID: string, message: string) {
        console.log(userID + ': ' + message);
        let request = message ? { type: 'text', payload: message } : null;
        let state = null;
        const data = {
            request: request,
            state: state
        }
        const config = {
            headers: {
                Authorization: this.key
            }
        }
        axios.post(this.url, data, config).then((response) => {
            for (const trace of response.data.trace) {
                if (trace.type === 'speak') {
                    this.messages.push(trace.payload.message);
                }
            }
            success();
        }).catch((error) => {
            console.log(error.message);
        });
    }

    getMessages() {
        const messages = this.messages;
        this.messages = [];
        return messages;
    }
}