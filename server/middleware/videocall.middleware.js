const decoder = require("jwt-decode");
// exports.joinVideoCallCheck = (req, res, next) => {
//   req.body["authorized_user"] = decoder(
//     req.headers?.authorization.split(" ")[1]
//   );
//   return next();
// };

exports.createVideoCallCheck = (req, res, next) => {
  req.body["authorized_user"] = decoder(
    req.headers.authorization.split(" ")[1]
  );
  return next();
};
