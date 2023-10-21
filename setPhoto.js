const { Client } = require("./wrapper/client");
const User = require("./suprema/user");
const Face = require("./suprema/face");
const data = require("./data.json");
const { DEVICE_ID } = require("./config");

(async () => {
  const client = new Client();
  client.userInit();
  client.faceInit()
  const imageData = data.facesList[0].imagedata;
  try {
    var userFace = new User.userMessage.UserFace();
    userFace.setUserid(data.hdr.id);
    var faceData = new Face.faceMessage.FaceData();
    faceData.setImagedata(Uint8Array.from(
      Buffer.from(imageData, "base64").toJSON().data
    ));
    faceData.setFlag(257);
    userFace.addFaces(faceData,0)
    const reponse = await User.setFace(DEVICE_ID, [
      userFace,
    ]);
  } catch (error) {
    console.info(error);
  }
})();
