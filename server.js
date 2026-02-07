import express from 'express';
import cors from 'cors';
import jsonGraphqlExpress from 'json-graphql-server/node';
import { data } from './db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; 
import { authMiddleware } from './auth-middleware.js';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const app = express();
const server = createServer(app);

const params = process.env.ENV_TYPE == 'dev' 
  ? { server }
  : { server, path: '/ws', clientTracking: true };
const wss = new WebSocketServer(params);

app.use(cors());
app.use(bodyParser.json());
app.use(authMiddleware());

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email && u.password === password);

  if (!user) {
      return res.status(401).json({ error: 'Неверные логин/пароль' });
  }

  const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return res.json({ token, user: userWithoutPassword });
});

app.use('/graphql', jsonGraphqlExpress(data));

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  console.log(`WebSocket server on port ${PORT}`);
});