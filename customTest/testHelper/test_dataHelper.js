// start test:
/*
node ./customTest/testHelper/test_dataHelper.js
 */

const DataHelper = require("../../helpers/DataHelper");

let datas_obj = {
  "1": {
    "username": "admin",
    "id": "1",
  },
  "2": {
    "username": "user1",
    "id": "2",
  },
  "3": {
    "username": "user2",
    "id": "3",
  }
};

let prop = "username";


// test1
// object.isDataValueExist
let test1_data = {
  "username": "user",
  "password": "123"
};
console.log('test1 start');
let test1 = DataHelper.object.isDataValueExist(datas_obj, test1_data, prop);
test1 == true ? console.log('result: pass') : console.log('result: fail');


// test object.isDataValueExistExcepCurrentValue
// test2
let test2_data = {
  "username": "user",
  "password": "123"
};
let test2_data_id = "2";
console.log('test2 start');
let test2 = DataHelper.object.isDataValueExistExcepCurrentValue(datas_obj, test2_data, prop, test2_data_id);
test2 == false ? console.log('result: pass') : console.log('result: fail');


// test object.isDataValueExistExcepCurrentValue
// test3
let test3_data = {
  "username": "admin",
  "password": "123"
};
let test3_data_id = "2";
console.log('test3 start');
let test3 = DataHelper.object.isDataValueExistExcepCurrentValue(datas_obj, test3_data, prop, test3_data_id);
test3 == true ? console.log('result: pass') : console.log('result: fail');


// -------------------------------------------

let datas_obj_arr =
  [
    {
      "username": "admin",
      "id": "1",
    },
    {
      "username": "user1",
      "id": "2",
    },
    {
      "username": "user2",
      "id": "3",
    }

  ]

let test4 = DataHelper.objectArray.isDataValueExist(datas_obj_arr,
  {
    "username": "user2",
    "id": "3",
  }, "username");

console.log('test4 start');
test4 == true ? console.log('pass') : console.log('fail');