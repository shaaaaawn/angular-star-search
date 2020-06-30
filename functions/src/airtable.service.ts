import { environment } from './environment';
import * as admin from 'firebase-admin';
const serviceAccount = require('./service_act.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: environment.firebase.databaseURL,
  storageBucket: environment.firebase.storageBucket,
});

export interface Vote {
  uid: string;
  ip_address: string;
  email: string;
  star_id: string;
  valid: true;
  create_date: any;
}

const Airtable = require('airtable');
const Bottleneck = require('bottleneck');
const cache = require('./caching');

async function cachePathForRequest(path: any) {
  return 'cache/_' + path + '.json';
}

const rateLimiter = new Bottleneck({
  minTime: 1050 / 5,
}); // ~5 requests per second

const tableNames = {
  stars: 'star-search',
};

export async function refreshCache() {
  await cache.clearCache();
  const stars = await starsRequest();
  const _cache = {
    stars: stars,
  };
  return _cache;
}

// export async function sendResultWithResponse(cachedResult) {
//   await res
// };

export async function starsRequest() {
  const base = new Airtable({
    apiKey: environment.airtable.key,
  }).base(environment.airtable.base);
  const viewName = 'Master';

  const cachePath = await cachePathForRequest('stars');
  // console.log("cachePath: " + cachePath);
  const cachedResult = await cache.readCacheWithPath(cachePath);
  console.log('cacheResult: ' + cachedResult);

  if (cachedResult !== null) {
    console.log('Cache hit. Returning cached result for ' + cachePath);
    // await sendResultWithResponse(cachedResult);
    return cachedResult;
  } else {
    console.log('No Cache. Loading from Airtable for ' + cachePath);
    const _response: any[] = [];
    rateLimiter.wrap(
      base(tableNames.stars)
        .select({
          view: viewName,
          pageSize: 100,
        })
        .eachPage(
          async function page(records: any, fetchNextPage: any) {
            records.forEach(async function (record: any) {
              const result = {
                id: record.get('id') || null,
                a_id: record.id || null,
                status: record.get('status') || 'blocked',
                image_url: record.get('image_url') || '',
                dog_name: record.get('caption') || '',
                about_dog: record.get('about_dog') || '',
                insta: record.get('insta') || '',
                // dog_bday: record.get("dog_bday") || "",
                votes: record.get('votes') || 0,
                thumbs: {},
              };

              if (record.get('image2')) {
                result.thumbs = {
                  small: {
                    thumb_url:
                      record.get('image2')[0].thumbnails.small.url || null,
                    width:
                      record.get('image2')[0].thumbnails.small.width || null,
                    height:
                      record.get('image2')[0].thumbnails.small.height || null,
                  },
                  large: {
                    thumb_url:
                      record.get('image2')[0].thumbnails.large.url || null,
                    width:
                      record.get('image2')[0].thumbnails.large.width || null,
                    height:
                      record.get('image2')[0].thumbnails.large.height || null,
                  },
                };
                result.image_url = record.get('image2')[0].thumbnails.large.url;
              }

              if (record.get('image')) {
                result.thumbs = {
                  small: {
                    thumb_url:
                      record.get('image')[0].thumbnails.small.url || null,
                    width:
                      record.get('image')[0].thumbnails.small.width || null,
                    height:
                      record.get('image')[0].thumbnails.small.height || null,
                  },
                  large: {
                    thumb_url:
                      record.get('image')[0].thumbnails.large.url || null,
                    width:
                      record.get('image')[0].thumbnails.large.width || null,
                    height:
                      record.get('image')[0].thumbnails.large.height || null,
                  },
                };
                result.image_url = record.get('image')[0].thumbnails.large.url;
              }

              if (result.status === 'approved') {
                _response.push(result);
              }
            });
            fetchNextPage();
          },
          async function done(error: any) {
            if (error) {
              throw new Error('Airtable Service Error: ' + error);
            }
            await cache.writeCacheWithPath(cachePath, _response);
            console.log('Returning records');
            return _response;
          }
        )
    );
  }
}

export async function winnersRequest() {
  const base = new Airtable({
    apiKey: environment.airtable.key,
  }).base(environment.airtable.base);
  const viewName = 'Winners';

  const cachePath = await cachePathForRequest('winners');
  // console.log("cachePath: " + cachePath);
  const cachedResult = await cache.readCacheWithPath(cachePath);
  console.log('cacheResult: ' + cachedResult);

  if (cachedResult !== null) {
    console.log('Cache hit. Returning cached result for ' + cachePath);
    // await sendResultWithResponse(cachedResult);
    return cachedResult;
  } else {
    console.log('No Cache. Loading from Airtable for ' + cachePath);
    const _response: any[] = [];
    rateLimiter.wrap(
      base(tableNames.stars)
        .select({
          view: viewName,
          pageSize: 100,
        })
        .eachPage(
          async function page(records: any, fetchNextPage: any) {
            records.forEach(async function (record: any) {
              let result = {
                id: record.get('id') || null,
                a_id: record.id || null,
                status: record.get('status') || 'blocked',
                image_url: record.get('image_url') || '',
                dog_name: record.get('caption') || '',
                about_dog: record.get('about_dog') || '',
                insta: record.get('insta') || '',
                // dog_bday: record.get("dog_bday") || "",
                votes: record.get('votes') || 0,
                thumbs: {},
              };

              if (record.get('image2')) {
                result.thumbs = {
                  small: {
                    thumb_url:
                      record.get('image2')[0].thumbnails.small.url || null,
                    width:
                      record.get('image2')[0].thumbnails.small.width || null,
                    height:
                      record.get('image2')[0].thumbnails.small.height || null,
                  },
                  large: {
                    thumb_url:
                      record.get('image2')[0].thumbnails.large.url || null,
                    width:
                      record.get('image2')[0].thumbnails.large.width || null,
                    height:
                      record.get('image2')[0].thumbnails.large.height || null,
                  },
                };
                result.image_url = record.get('image2')[0].thumbnails.large.url;
              }

              if (record.get('image')) {
                result.thumbs = {
                  small: {
                    thumb_url:
                      record.get('image')[0].thumbnails.small.url || null,
                    width:
                      record.get('image')[0].thumbnails.small.width || null,
                    height:
                      record.get('image')[0].thumbnails.small.height || null,
                  },
                  large: {
                    thumb_url:
                      record.get('image')[0].thumbnails.large.url || null,
                    width:
                      record.get('image')[0].thumbnails.large.width || null,
                    height:
                      record.get('image')[0].thumbnails.large.height || null,
                  },
                };
                result.image_url = record.get('image')[0].thumbnails.large.url;
              }

              if (result.status === 'approved') {
                _response.push(result);
              }
            });
            fetchNextPage();
          },
          async function done(error: any) {
            if (error) {
              throw new Error('Airtable Service Error: ' + error);
            }
            await cache.writeCacheWithPath(cachePath, _response);
            console.log('Returning records');
            return _response;
          }
        )
    );
  }
}

export async function vote(request: any, response: any) {
  try {
    if (!request) {
      return 'No Body';
    }

    const db = admin.firestore();
    var votesRef = db.collection('day_8');
    var query = votesRef
      .where('email', '==', JSON.stringify(request.email))
      .where('star_id', '==', JSON.stringify(request.star_id));
    query
      .get()
      .then((snapshot) => {
        console.log('Votes Total: ', snapshot.size);
        if (snapshot.size == 0) {
          let data = {
            email: JSON.stringify(request.email),
            star_id: JSON.stringify(request.star_id),
            create_date: new Date(),
            valid: true,
            uid: '',
          };

          votesRef
            .doc()
            .set(data)
            .then((_response) => {
              console.log('Response: ', _response);
              response
                .status(200)
                .send({ voted: true, message: 'Vote Success' });
              return;
            })
            .catch((err) => {
              console.log(err);
              throw Error(err);
            });
        } else if (snapshot.size >= 1) {
          console.log('already voted');
          response.status(200).send({
            voted: false,
            message: 'You Already Voted For This Star Today',
          });
          return;
        }
        return;
      })
      .catch((err) => {
        throw Error(err);
      });
    return;
  } catch (err) {
    console.log('Vote Error' + err);
    response.status(400).send({ voted: false, message: 'Error', error: err });
    return;
  }
}
