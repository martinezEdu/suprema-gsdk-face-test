const user = require('../user');
const finger = require('../finger');
const util = require('../util');

const NUM_OF_NEW_USER = 3;
const START_USER_ID = 10000000;
const TEMPLATE_FORMAT = finger.TEMPLATE_FORMAT_SUPREMA;

function getNewUserIDs() {
  var userIDs = [];

  for(i = 0; i < NUM_OF_NEW_USER; i++) {
    userIDs.push(`${START_USER_ID + i}`);
  }

  return userIDs;
}


function makeNewUser() {
  var userInfos = [];

  for(i = 0; i < NUM_OF_NEW_USER; i++) {
    let userInfo = new user.userMessage.UserInfo();
    let userHdr = new user.userMessage.UserHdr();
    userHdr.setId(`${START_USER_ID + i}`);
    userInfo.setHdr(userHdr);

    userInfos.push(userInfo);
  }

  return userInfos;
}

async function testSetFinger(devID, userID) {
  try {
    var fingerData = new finger.fingerMessage.FingerData();

    var userIDs = []
    userIDs.push(userID);

    var userInfos = util.toObjectArray(await user.getUser(devID, userIDs));
    console.log('User without fingerprint: ', userInfos[0]);

    console.log('>>> Scan a finger');
    var templateData = await finger.scan(devID, TEMPLATE_FORMAT, 50);
    fingerData.addTemplates(templateData, 0);

    console.log('>>> Scan the same finger again');
    templateData = await finger.scan(devID, TEMPLATE_FORMAT, 50);
    fingerData.addTemplates(templateData, 1);
    
    var userFingers = [];
    var userFinger = new user.userMessage.UserFinger();
    userFinger.setUserid(userID);
    userFinger.addFingers(fingerData, 0);
    userFingers.push(userFinger);

    await user.setFinger(devID, userFingers);

    userInfos = await user.getUser(devID, userIDs);
    console.log('User with fingerprint: ', userInfos[0]);
  }
  catch(err) {
    console.error('Cannot finish the setFinger test: ', err);
    throw err;
  }
}

async function test(devID) {
  try {
    var hdrs = util.toObjectArray(await user.getList(devID));
    console.log('User list: ', hdrs);

    var userIDs = [];
    for(i = 0; i < hdrs.length; i++) {
      userIDs.push(hdrs[i].id);
    }
    
    const userInfos = util.toObjectArray(await user.getUser(devID, userIDs));
    for(i = 0; i < userInfos.length; i++) {
      console.log('User: ', userInfos[i]);
    }

    await user.enroll(devID, makeNewUser());  

    hdrs = util.toObjectArray(await user.getList(devID));
    console.log('User list after enrolling new users: ', hdrs);

    await testSetFinger(devID, getNewUserIDs()[0]);

    await user.deleteUser(devID, getNewUserIDs());

    hdrs = util.toObjectArray(await user.getList(devID));
    console.log('User list after deleting new users: ', hdrs);  
  }
  catch(err) {
    console.error('Cannot finish the user test: ', err);
    throw err;
  }
}

module.exports.test = test;