const DataHelper = require("../helpers/DataHelper");
const FormatHelper = require("../helpers/FormatHelper");



const FrontUserValidator = {
  checkNewUser(users, user) {

    let requireField = ['email', 'password'];

    for (v of requireField) {
      if (!user[v]) return { error: `${v} blank` };
      if (FormatHelper.hasSpaceBetween(user[v])) {
        return { error: `${v} cannnot has space between string` };
      }
    }
    if (!FormatHelper.isEmailValid(user.email)) {
      return { error: 'invalid email format' };
    }

    if (DataHelper.object.isDataValueExist(users, user, "email")) {
      return { error: `email '${user.email}' exists` };
    }
    if (user.email.length > 255) {
      return { error: `email max-length:255` };
    }
    if (user.password.length > 255) {
      return { error: `password max-length:255` };
    }

    return {
      result: 'valid'
    };

  },
  checkUpdateUser(user, users) {
    
    // email cannot be changed

    let optionalField = [
      'firstName',
      'lastName',
      'email2',
      'phone',
      'mobile',
      'address',
      'gender',
      'birthDate',

    ];
    
    let keys = Object.keys(user);

    for (k of keys) {
      if(optionalField.indexOf(k)==-1){
        return {error: `${k} is not a valid field for modifying`};
      }
      if (!user[k]) return { error: `${v} blank` };

      if(user[k] && k=='email2' && !FormatHelper.isEmailValid(user[k])){
        return {error: `invalid email format: '${user[k]}'`};
      }
    }

    return {
      result: 'valid'
    };
  },
  chkUserPassword(user) {
    let requireField = ['password', 'confirmPassword'];

    for (v of requireField) {
      if (!user[v]) return { error: `${v} blank` };
      if (user[v][0] == " ") {
        return { error: `password cannot starts with blank` };
      }
      if (FormatHelper.hasSpaceBetween(user[v])) {
        return { error: `${v} cannnot has space between string` };
      }
      if (user[v].length > 255) {
        return { error: `password max-length:255` };
      }
    }
    if (user.password !== user.confirmPassword) {
      return { error: `password not match` };
    }


    return {
      result: 'valid'
    };

  }

}






module.exports = FrontUserValidator;