import { Server, Socket } from 'socket.io';

export const subscribers: Set<Socket> = new Set();

export const WebsocketInit = () => {
  const io = new Server({
    cors: {
      origin: '*'
    }
  });
  
  io.on('connection', (socket: Socket) => {
    console.log('A new WebSocket connection has been established.');
    subscribers.add(socket);
  
    socket.on('disconnect', () => {
      console.log('A WebSocket connection has been disconnected.');
      subscribers.delete(socket);
    });
  });
  
  io.listen(8081);
  console.log(`Server is running on port 8081`);
}