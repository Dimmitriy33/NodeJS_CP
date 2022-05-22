/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WS = require('ws');

const wss = new WS.Server(
  {
    port: 8001,
    host: 'localhost'
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

wss.on('connection', (clientSocket) => {
  clientSocket.on('message', (data) => {
    console.log(data);
    clientSocket.send(data);
  });
});
