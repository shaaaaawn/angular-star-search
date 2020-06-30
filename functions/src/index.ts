import * as functions from 'firebase-functions';
const cors = require('cors');
import * as airtableService from './airtable.service';
import * as analyticsService from './analytics-service';

const options = {
  origin: ['http://localhost:4200', 'https://puppiesmakemehappy.com'],
};

// stars airtable-service
exports.Stars = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    // console.log(request.body);
    return cors(options)(request, response, async () => {
      response.set('Access-Control-Allow-Origin', '*');
      response.set('Access-Control-Allow-Headers', 'Content-Type');
      try {
        if (request.path.includes('All')) {
          const result = await airtableService.starsRequest();
          response.status(200).end(JSON.stringify(result));
        } else if (request.path.includes('Winners')) {
          const result = await airtableService.winnersRequest();
          response.status(200).end(JSON.stringify(result));
        } else if (request.path.includes('Clear')) {
          const result = await airtableService.refreshCache();
          response.status(200).end(JSON.stringify(result));
        } else if (request.path.includes('Vote')) {
          const result = await airtableService.vote(request.body, response);
          console.log(result);
          // response.status(200).end(JSON.stringify(result));
        } else response.send('Endpoint Not Found');
      } catch (err) {
        console.log(err);
        response.status(400).send({ Error: err });
      }
    });
  }
);

exports.Analytics = functions.https.onRequest(
  async (request: functions.Request, response: any) => {
    console.log(request.body);
    if (request.path.includes('All')) {
      const result = await analyticsService.runStats();
      response.status(200).end(JSON.stringify(result));
    }
  }
);

exports.Analytics = functions.https.onRequest(
  async (request: functions.Request, response: any) => {
    console.log(request.body);
    const result = await analyticsService.runStats();
    response.status(200).end(JSON.stringify(result));
  }
);

exports.Emails = functions.https.onRequest(
  async (request: functions.Request, response: any) => {
    console.log(request.body);
    const result = await analyticsService.getEmails();
    response.status(200).end(JSON.stringify(result));
  }
);

exports.voteWrite2 = functions.firestore
  .document('day_1/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_1', snapshot);
  });
exports.voteWrite2 = functions.firestore
  .document('day_2/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_2', snapshot);
  });
exports.voteWrite3 = functions.firestore
  .document('day_3/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_3', snapshot);
  });
exports.voteWrite4 = functions.firestore
  .document('day_4/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_4', snapshot);
  });
exports.voteWrite5 = functions.firestore
  .document('day_5/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_5', snapshot);
  });
exports.voteWrite6 = functions.firestore
  .document('day_6/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_6', snapshot);
  });
exports.voteWrite7 = functions.firestore
  .document('day_7/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_7', snapshot);
  });
exports.voteWrite8 = functions.firestore
  .document('day_8/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_8', snapshot);
  });
exports.voteWrite9 = functions.firestore
  .document('day_9/{uid}')
  .onCreate(async (snapshot: any) => {
    await analyticsService.addVote('day_9', snapshot);
  });
