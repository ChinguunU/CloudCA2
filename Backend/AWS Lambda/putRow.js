const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});

  let responseBody = "";
  let statusCode = 0;

  const { country, date, nextDayPrediction, rateOfGrowth, nextDayPredictionDeaths, rateOfGrowthDeaths } = JSON.parse(event.body);

  const params = {
    TableName: "covid_analysis",
    Item: {
      country: country,
      date: date,
      nextDayPrediction: nextDayPrediction,
      rateOfGrowth: rateOfGrowth,
      nextDayPredictionDeaths: nextDayPredictionDeaths,
      rateOfGrowthDeaths: rateOfGrowthDeaths
    }
  }

  try {
    await documentClient.put(params).promise();
    responseBody = "Successfully put data update";
    statusCode = 201;
  } catch (err) {
    responseBody = `Unable to put user data`;
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