const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

//running code
exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});

  let responseBody = "";
  let statusCode = 0;
  
  const { country } = event.pathParameters;
  const date = event.queryStringParameters.date;

  const params = {
    TableName: "covid_analysis",
    Key: {
      country: country,
      date: date
    }
  }

  try {
    const data = await documentClient.get(params).promise();
    responseBody = JSON.stringify(data.Item);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to get user data`;
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "myHeader": "test"
    },
    body: responseBody
  }
  
  return response;
}