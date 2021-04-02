let scriptName = __filename.slice(__dirname.length + 1)

const DataHelper = {

  object: {
    /* datas format:
    {
      id1:{k1:v1,k2:v2,...},
      id2:{k1:v1,k2:v2,...},
      id3:{k1:v1,k2:v2,...},
      ...
    }

    props in datas is regarded as unique id for the value obj of  each prop.
    e.g. the id for {k1:v1,k2:v2,...} is id1

    */
    isDataValueExist: (datas, data, prop) => {
      datas = Object.entries(datas);
      return datas.some((arr) => {
        // let k = arr[0];
        let o = arr[1];
        return o[prop] == data[prop];
      });
    },

    isDataValueExistExcepCurrentValue: (datas, data, prop, data_id) => {

      datas = Object.entries(datas);

      // data_id is the id value of the data
      // sometimes it won't be stored in the data
      if (!data_id) throw `error from ${scriptName}:id is blank!`;

      return datas.some((arr) => {
        let k = arr[0];
        let o = arr[1];
        return o[prop] == data[prop] && data_id !== k;
      });
    }
  },

  objectArray: {
    /* datas format:
      [
        {k1:v1,k2:v2,...},
        {k1:v1,k2:v2,...},
        {k1:v1,k2:v2,...},
        ...
      ]
    */
    isDataValueExist: (datas, data, prop) => {
      return datas.some((o) => o[prop] == data[prop]);
    },
    isDataValueExistExcepCurrentValue: (datas, data, prop, prop_id, data_id) => {

      // prop_id is id property name(not id value!!) of datas

      // data_id is the id value of the data
      // sometimes it won't be stored in the data

      if (!prop_id) throw `error from ${scriptName}:prop_id is blank!`;
      if (!data_id) throw `error from ${scriptName}:id is blank!`;
      return datas.some((o) => o[prop] == data[prop] && data_id !== o[prop_id]);
    }

  },

  isDataValueExist: (datas, data, prop) => {
    datas = Object.entries(datas);
    return datas.some((k, o) => o[prop] == data[prop]);
  },
  isDataValueExistExcepCurrentValue: (datas, data, prop, prop_id, data_id) => {

    // prop_id is id property name(not id value!!) of datas

    // data_id is the id value of the data
    // sometimes it won't be stored in the data

    if (!prop_id) throw `error from ${scriptName}:prop_id is blank!`;
    if (!data_id) throw `error from ${scriptName}:id is blank!`;
    return datas.some((o) => o[prop] == data[prop] && data_id !== o[prop_id]);
  }

}

module.exports = DataHelper;