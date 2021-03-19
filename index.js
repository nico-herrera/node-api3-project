// require your server and launch it
require("dotenv");
const server = require("./api/server");

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`*** listening on port:${PORT} ***`);
});
