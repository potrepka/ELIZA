import axios from 'axios';

const api = require('./api.json');
const url = 'https://general-runtime.voiceflow.com/interact/'

export class Voiceflow {
  url: string;
  key: string;
  messages: string[];
  state: Map<string, any>;
  maxStates: number;

  constructor(maxStates: number = Infinity) {
    this.url = url + api.versionID;
    this.key = api.key;
    this.messages = [];
    this.state = new Map<string, any>();
    this.maxStates = maxStates;
  }

  start(success: () => void, userID: string) {
    this.process(success, userID, '');
  }

  message(success: () => void, userID: string, message: string) {
    this.process(success, userID, message);
  }

  process(success: () => void, userID: string, message: string) {
    let request = message ? { type: 'text', payload: message } : null;
    let state = this.getState(userID);
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
      this.setState(userID, response.data.state);
      for (const trace of response.data.trace) {
        if (trace.type === 'speak') {
          this.pushMessage(trace.payload.message);
        }
      }
      success();
    }).catch((error) => {
      console.log(error.message);
    });
  }

  pushMessage(message: string) {
    this.messages.push(message);
  }

  getMessages() {
    const messages = this.messages;
    this.messages = [];
    return messages;
  }

  getState(userID: string) {
    return this.state.get(userID);
  }

  setState(userID: string, state: any) {
    if (this.state.has(userID)) {
      this.state.delete(userID);
    } else if (this.state.size == this.maxStates) {
      this.state.delete(this.state.keys().next().value);
    }
    this.state.set(userID, state);
  }
}