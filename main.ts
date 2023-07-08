import { createServer } from "./src/server";

const hostname = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT) || 3000;

const server = createServer();

server.keepAliveTimeout = 60 * 1000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
