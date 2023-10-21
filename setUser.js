const { Client } = require("./wrapper/client");
const User = require("./suprema/user");
const Face = require("./suprema/face");
const data = require("./data.json");
const { DEVICE_ID } = require("./config");

(async () => {
  const client = new Client();
  client.userInit();
  var newUserHdr = new User.userMessage.UserHdr();
  newUserHdr.setId(data.hdr.id);
  var newUser = new User.userMessage.UserInfo();
  newUser.setName(data.name);
  newUser.setHdr(newUserHdr);
  try {
    await User.enroll(DEVICE_ID, [newUser]);
  } catch (error) {
    console.info(error);
  }
})();
