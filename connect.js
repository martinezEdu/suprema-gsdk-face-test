const { Client } = require("./wrapper/client");

(async () => {
  const client = new Client();
  const disallowedDevices = await client.getDisallowedDevices();
  console.info(disallowedDevices);
  await client.setAllowedDevices(disallowedDevices);
})();
