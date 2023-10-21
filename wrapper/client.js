const path = require("path");
const connect = require("../suprema/connect");
const event = require("../suprema/event");
const card = require("../suprema/card");
const user = require("../suprema/user");
const util = require("../suprema/util");
const finger = require("../suprema/finger");
const face = require("../suprema/face")
const grpc = require("grpc");
const fs = require("fs");

const { GATEWAY_IP, GATEWAY_PORT } = require("../config");

const GATEWAY_CA_FILE = "../cert/ca.crt";
const CODE_MAP_FILE = "../suprema/event/event_code.json";
class Client {
  isConect = false;
  constructor() {
    var rootCa = fs.readFileSync(path.resolve(__dirname, GATEWAY_CA_FILE));
    this.sslCreds = grpc.credentials.createSsl(rootCa);
    this.addr = `${GATEWAY_IP}:${GATEWAY_PORT}`;
    this.connect();
  }

  connect() {
    try {
      connect.initClient(this.addr, this.sslCreds);
      this.isConect = true;
    } catch (error) {
      console.info(error);
    }
  }

  async disconnect() {
    await connect.disconnect()
  }

  userInit() {
    user.initClient(this.addr, this.sslCreds);
  }

  fingerInit(){
    finger.initClient(this.addr, this.sslCreds);
  }

  faceInit(){
    face.initClient(this.addr, this.sslCreds);
  }

  cardInit(){
    card.initClient(this.addr, this.sslCreds);
  }

  connectEvent() {
    try {
      const codeMapFilePath = path.resolve(__dirname, CODE_MAP_FILE);
      event.initClient(this.addr, this.sslCreds);
      event.initCodeMap(codeMapFilePath);
      card.initClient(this.addr, this.sslCreds);
      user.initClient(this.addr, this.sslCreds);
    } catch (error) {
      console.info(JSON.stringify(error));
    }
  }

  async getDeviceList() {
    return (await connect.getDeviceList()).map((e) => e.toObject());
  }

  async getDevicesOnline() {
    return (await this.getDeviceList()).filter((e) => e.connectionmode === 1);
  }

  async sync() {
    try {
      const devices = await this.getDeviceToAsyncConnection();
      await connect.addAsyncConnection(devices);
    } catch (error) {
      console.info(error)
    }
  }

  subscribeUser(callBack) {
    const sub = event.subscribe(QUEUE_SIZE);

    sub.on("data", (event) => {
      if (callBack != null) {
        callBack(event.toObject());
      } else {
        console.log("Event: ", event.toObject());
      }
    });

    sub.on("end", () => {
      console.log("Monitoring is finished");
    });

    sub.on("error", (err) => {
      if (err.details === "Cancelled") {
        console.log("Monitoring is cancelled");
      } else {
        console.log("Monitoring error: ", err);
      }
    });
  }

  subscribeDevice(callBack) {
    const sub = connect.subscribe(QUEUE_SIZE);

    sub.on("data", (status) => {
      var devStatus = status.getStatus();

      switch (devStatus) {
        case connect.connectMessage.Status.DISCONNECTED:
        case connect.connectMessage.Status.TCP_CONNECTED:
        case connect.connectMessage.Status.TLS_CONNECTED:
          callBack(status);
          break;
      }
    });

    sub.on("end", () => {
      console.log("Subscription is finished");
    });

    sub.on("error", (err) => {
      if (err.details === "Cancelled") {
        console.log("Subscription is cancelled");
      } else {
        console.log("Subscription error: ", err);
      }
    });
  }

  async getDisallowedDevices() {
    try {
      var devList = await connect.getPendingList();
      return util.toObjectArray(devList).map(({ deviceid }) => deviceid);
    } catch (err) {
      if (err?.code == 14) {
        this.isConect = false;
      }
    }
  }

  async setAllowedDevices(devices) {
    var newFilter = new connect.connectMessage.AcceptFilter();
    newFilter.setAllowall(false);
    newFilter.setDeviceidsList(devices);
    await connect.setAcceptFilter(newFilter);
  }

  async getAllowedDevices() {
    try {
      var oldFilter = await connect.getAcceptFilter();
      return oldFilter.getDeviceidsList();
    } catch (err) {
      if (err?.code == 14) {
        this.isConect = false;
      }
    }
  }

  async showAcceptFilter() {
    try {
      var filter = await connect.getAcceptFilter();

      console.log("\n***** Accept filter: ", filter.toObject());
    } catch (err) {
      console.error("Cannot get the accept filter: ", err);
    }
  }
}

module.exports.Client = Client;
