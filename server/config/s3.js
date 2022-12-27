const aws = require("aws-sdk");
const {
  bucketAccessKeyId,
  bucketLocation,
  bucketSecretAccessKey,
} = require("./main");

const spacesEndpoint = new aws.Endpoint(bucketLocation);

exports.s3 = new aws.S3({
  accessKeyId: bucketAccessKeyId,
  secretAccessKey: bucketSecretAccessKey,
  endpoint: spacesEndpoint,
});

exports.MEDIA_CDN_URL =
  "https://donnysliststory.sfo3.cdn.digitaloceanspaces.com/";
