const DataHelper = require("../helpers/DataHelper");
const FormatHelper = require("../helpers/FormatHelper");



const CpUserValidator = {
  checkNewUser(users, user) {

    let requireField = ['username', 'password'];

    for (v of requireField) {
      if (!user[v]) return { error: `${v} blank` };
      if (FormatHelper.hasSpaceBetween(user[v])) {
        return { error: `${v} cannnot has space between string` };
      }
    }

    if (DataHelper.object.isDataValueExist(users, user, "username")) {
      return { error: `username '${user.username}' exists` };
    }
    if (user.username.length > 20) {
      return { error: `username max-length:20` };
    }
    if (user.password.length > 255) {
      return { error: `password max-length:255` };
    }

    return {
      result: 'valid'
    };

  },
  checkUpdateUser(user) {
    // cp user cannot change username
    let requireField = ['password'];

    for (v of requireField) {
      if (!user[v]) return { error: `${v} blank` };
      if (FormatHelper.hasSpaceBetween(user[v])) {
        return { error: `${v} cannnot has space between string` };
      }
    }
    
    if (user.password.length > 255) {
      return { error: `password max-length:255` };
    }

    return {
      result: 'valid'
    };
  }
  
}






module.exports = CpUserValidator;