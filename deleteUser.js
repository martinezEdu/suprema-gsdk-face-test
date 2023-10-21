const { Client } = require("./wrapper/client");
const User = require("./suprema/user");
const Face = require("./suprema/face");
const data = require("./data.json");
const { DEVICE_ID } = require("./config");

(async () => {
  const client = new Client();
  client.userInit();
  try {
    await User.deleteUser(DEVICE_ID, [data.hdr.id]);
  } catch (error) {
    console.info(error);
  }
})();
