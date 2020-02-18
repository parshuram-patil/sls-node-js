'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3()
var ses = new AWS.SES({ region: 'eu-west-1' });
var got = require('got')

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

  var fromEmail = "parshuram.patil@outlook.in"
  var toEmail = event.queryStringParameters.email

  const params = {
    Source: fromEmail,
    Destination: {
      ToAddresses: [toEmail],
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

  var response = {
    statusCode: 500,
    body: {}
  }

  var sendPromise = ses.sendEmail(params).promise();
  await sendPromise.then(function (result) {
    response["statusCode"] = 200
    response["body"] = {
      messageId: result.MessageId
    }
  }).catch(function (reason) {
    response["body"] = {
      error: reason
    }
  });

  return JSON.stringify(response)
}

module.exports.sendTemplatedEmail = async event => {
  var fromEmail = "parshuram.patil@outlook.in"
  var toEmail = "parasharam.patil@siemens.com"
  var byEmail = event.queryStringParameters.email

  const params = {
    Source: fromEmail,
    Template: "SampleTemplate",
    Destination: {
      ToAddresses: [toEmail],
    },
    TemplateData: "{\"toName\":\"" + getNameFromEmail(toEmail) + "\",\"fromName\":\"" + getNameFromEmail(byEmail) + "\",\"fromEmail\":\"" + byEmail + "\"}"
  }

  var response = {
    statusCode: 500,
    body: {}
  }

  var sendPromise = ses.sendTemplatedEmail(params).promise();
  await sendPromise.then(function (result) {
    response["statusCode"] = 200
    response["body"] = {
      messageId: result.MessageId
    }
  }).catch(function (reason) {
    response["body"] = {
      error: reason
    }
  });

  return JSON.stringify(response)

  function getNameFromEmail(email) {
    var name = email.split('.')[0]

    return name.charAt(0).toUpperCase() + name.substring(1);
  }
}

module.exports.httpGotClient = async event => {
  got('https://www.google.com/')
    .then(response => {
      console.log(response.statusCode)
    })
    .catch(error => {
      console.log(error.response.body);
    })
}
