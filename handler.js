'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3()
var ses = new AWS.SES({ region: 'eu-west-1' });

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.listBuckets = async event => {
  s3.listBuckets(function (err, data) {
    if (err) throw err;
    data.Buckets.forEach(function (bucket, index, buckets) {
      console.log(index + " : " + bucket.Name)
    })
  }
  );
}

module.exports.sendEmail = async event => {
  const params = {
    Source: "parshuram.patil@outlook.in",
    Destination: {
      ToAddresses: ["parasharam_patil@ymail.com"],
    },
    Message: {
      Subject: {
        Data: "SES Test",
        Charset: "UTF8"
      },
      Body: {
        Text: {
          Data: "Hi,\nThis a test mail using SES",
          Charset: "UTF8"
        },
      },
    },
  }

  ses.sendEmail(params, function (err, res) {
    if (err)
      console.log("Error ---> " + err.message)

    console.log("Success ---> " + res.MessageId);
  })
}
