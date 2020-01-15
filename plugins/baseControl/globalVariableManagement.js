var Variables = {
    userKey : ""
}


var isEmptyObject = function(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
}


exports.Variables = Variables;
exports.isEmptyObject = isEmptyObject;