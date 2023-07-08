import express from 'express';
import { BidApiInit } from './apiInits/bidApiInit';
import { UserApiInit } from './apiInits/userApiInit';
import { WebsocketInit } from './websocket';

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

//Websocket initialization
WebsocketInit();
//Api initialization
BidApiInit(app);
UserApiInit(app);

app.listen(8080, () => {
  console.log('API server is running on port 8080');
});

