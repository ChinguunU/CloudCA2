const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})

// running code
exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'})

  let responseBody = ''
  let statusCode = 0

  const { country } = event.pathParameters
  const date = event.queryStringParameters.date

  var params = {
    TableName: 'covid_analysis',
    ProjectionExpression: '#c, #d, nextDayPrediction, rateOfGrowth, nextDayPredictionDeaths, rateOfGrowthDeaths',
    KeyConditionExpression: '#c = :reqCountry and #d between :startDate and :reqDate',
    ExpressionAttributeNames: {
      '#c': 'country',
      '#d': 'date'
    },
    ExpressionAttributeValues: {
      ':reqCountry': country,
      ':reqDate': date,
      ':startDate': '25-05-20'
    }
  }
  await documentClient.query(params, function (err, data) {
    if (err) {
      console.log('Unable to query. Error:', JSON.stringify(err, null, 2))
      responseBody = 'Unable to get user data'
      statusCode = 403
    } else {
      console.log('Query succeeded.')
      responseBody = JSON.stringify(data.Items)
      statusCode = 200
    }
  }).promise()

  const response = {
    statusCode: statusCode,
    headers: {
      'myHeader': 'test'
    },
    body: responseBody
  }

  return response
}
