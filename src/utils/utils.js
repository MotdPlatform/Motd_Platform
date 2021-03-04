import CryptoJS from 'crypto-js';

let utils = ({
  isEmpty: function (obj) {
    if (obj == [] || typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },

  isIPv4: function (obj) {
    let reg = new RegExp(/\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}/);
    if (reg.exec(obj) != null) return true;
    return false;
  },

  isIPv6: function (obj) {
    let reg = new RegExp(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/);
    if (reg.exec(obj) != null) return true;
    return false;
  },

  isDomain: function (obj) {
    let reg = new RegExp(/^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/);
    if (reg.exec(obj) != null) return true;
    return false;
  },

  isPort: function (obj) {
    if (!(/^[1-9]\d*$/.test(obj) && 1 <= 1 * obj && 1 * obj <= 65535)) return false;
    return true;
  },

  symbolCompare: function (s1, s2, symbol) {
    switch (symbol) {
      case 0:
        if (s1 == s2) return true;
        break;
      case 1:
        if (s1 >= s2) return true;
        break;
      case 2:
        if (s1 <= s2) return true;
        break;
    }
    return false;
  },

  doCrypt: function (string, key, operation) {
    let d = new Date(),
      dMonth = (d.getMonth() + 1).toString(),
      dDate = d.getDate().toString(),
      dHour = d.getHours().toString(),
      dKey = d.getFullYear().toString() + ((dMonth.length == 2) ? dMonth : 0 + dMonth).toString() + ((dDate.length == 2) ? dDate : 0 + dDate).toString() + ((dHour.length == 2) ? dHour : 0 + dHour).toString();

    key = CryptoJS.MD5(dKey + key.toString()).toString();
    let iv = CryptoJS.enc.Utf8.parse(key.substring(0, 16));
    key = CryptoJS.enc.Utf8.parse(key.substring(0, 16));


    if (operation) {
      return CryptoJS.AES.decrypt(string, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
    }
    return CryptoJS.AES.encrypt(JSON.stringify(string), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  },
});

export default utils;
