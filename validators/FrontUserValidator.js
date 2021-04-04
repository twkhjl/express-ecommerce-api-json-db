const DataHelper = require("../helpers/DataHelper");
const FormatHelper = require("../helpers/FormatHelper");

const FrontUserValidator = {
  checkNewUser(users, user) {
    let requireField = ["firstName", "lastName", "email", "password"];
    let NoSpaceBetweenField = ["email", "password"];

    let lengthOfField = {
      firstName: 50,
      lastName: 50,
      email: 255,
      password: 255,
    };

    let result = {};

    for (v of requireField) {
      if (!user[v]) {
        result[v] = `error:blank`;
      }
      if (
        user[v] &&
        FormatHelper.hasSpaceBetween(user[v]) &&
        NoSpaceBetweenField.indexOf(v) !== -1
      ) {
        result[v] = `error:spaceBetween`;
      }
      if (user[v] && lengthOfField[v] && user[v].length > lengthOfField[v]) {
        result[v] = `error:maxLength:${lengthOfField[v]}`;
      }
    }
    if (user.email && !FormatHelper.isEmailValid(user.email)) {
      result.email = "error:emailFormat";
    }

    if (
      user.email &&
      DataHelper.object.isDataValueExist(users, user, "email")
    ) {
      result.email = `error:exist:${user.email}`;
    }

    return result;
  },
  checkUpdateUser(user, users) {
    // email cannot be changed

    let optionalField = [
      "firstName",
      "lastName",
      "email2",
      "phone",
      "mobile",
      "address",
      "gender",
      "birthDate",
    ];

    let keys = Object.keys(user);

    for (k of keys) {
      if (optionalField.indexOf(k) == -1) {
        return { error: `${k} is not a valid field for modifying` };
      }
      if (!user[k]) return { error: `${v} blank` };

      if (user[k] && k == "email2" && !FormatHelper.isEmailValid(user[k])) {
        return { error: `invalid email format: '${user[k]}'` };
      }
    }

    return {
      result: "valid",
    };
  },
  chkUserPassword(user) {
    let requireField = ["password", "confirmPassword"];

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
      result: "valid",
    };
  },
};

module.exports = FrontUserValidator;
