const { Client } = require("./wrapper/client");
const User = require("./suprema/user");
const data = require("./data.json");
const { DEVICE_ID } = require("./config");

(async () => {
  const client = new Client();
  client.userInit();
  client.faceInit();
  
  try {
    var userFace = new User.userMessage.UserFace();
    userFace.setUserid(data.hdr.id);
    await User.setFace(DEVICE_ID, [userFace]);
  } catch (error) {
    console.info(error);
  }
})();
