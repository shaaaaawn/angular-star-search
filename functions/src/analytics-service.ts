// import { environment } from "./environment";
// const request = require("request");

// const Bottleneck = require("bottleneck");
// const rateLimiter = new Bottleneck({
//   minTime: 1050 / 4,
//   maxConcurrent: 3
// }); // ~5 requests per second
import * as admin from "firebase-admin";
const db = admin.firestore();

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// async function verifyEmail(email: string) {
//   const emailRef = await db.doc("emails/" + email);
//   await emailRef
//     .get()
//     .then(async snap => {
//       if (snap.data()) {
//         console.log(email + " exists - Skipping");
//         return;
//       } else {
//         console.log(email + "does not exist - Lookup");
//         const url =
//           "https://api.debounce.io/v1/?api=" +
//           environment.debounce.key +
//           "&email=" +
//           email;
//         request(url, { json: true }, async (err: any, res: any, body: any) => {
//           if (err) {
//             console.log(err);
//             return err;
//           }
//           console.log(body.debounce);
//           await db
//             .collection("emails")
//             .doc(body.debounce.email)
//             .set(body.debounce);

//           return body.debounce;
//         });
//       }
//     })
//     .catch(err => {
//       console.log("error" + err);
//       return;
//     });
// }

export async function addVote(day: string, snapshot: any) {
  try {
    console.log("===Adding Vote");
    const vote = snapshot.data();
    vote.star_id = vote.star_id.replace(/['"]+/g, "");
    vote.star_id = vote.star_id.replace(/['-]+/g, "_");
    console.log(vote);
    const statsRef = db.doc("stats/all3");

    await statsRef.get().then(async snap => {
      let data = <any>snap.data();
      console.log(snap);
      data.all_count += 1;
      // data[day][vote.star_id] += 1;
      data.stars[vote.star_id] += 1;
      const newData = {
        all_count: data.all_count,
        stars: data.stars
      };
      await db
        .collection("stats")
        .doc("all3")
        .update(newData);
    });
  } catch (err) {
    throw new Error("===ERROR" + err);
  }
}
export async function runStats() {
  try {
    console.log("===Running Analytics");
    let data = <any>{
      all_count: 0,
      all_count_valid: 0,
      fakes: [],
      emails: [],
      emails_verified: [],
      emails_fake: [],
      // day_1: <any>{},
      // day_2: <any>{},
      // day_3: <any>{},
      // day_4: <any>{},
      // day_5: <any>{},
      // day_6: <any>{},
      // day_7: <any>{},
      // day_8: <any>{},
      // day_9: <any>{},
      // day_10: <any>{},
      total: <any>{},
      stars: <any>{},
      stars_valid: <any>{},
      top: <any>[]
    };

    for (let i = 1; i < 998; i++) {
      const uid = "star_" + i;
      data.stars[uid] = 0;
      // data.day_1[uid] = 0;
      // data.day_2[uid] = 0;
      // data.day_3[uid] = 0;
      // data.day_4[uid] = 0;
      // data.day_5[uid] = 0;
      // data.day_6[uid] = 0;
      // data.day_7[uid] = 0;
      // data.day_8[uid] = 0;
      // data.day_9[uid] = 0;
      // data.day_10[uid] = 0;
    }

    for (let day = 1; day < 9; day++) {
      let dateId = "day_" + day;
      console.log(dateId);
      const ordersRef = db.collection(dateId);
      const ref = ordersRef.where("valid", "==", true);
      await ref
        .get()
        .then(snapshot => {
          console.log(snapshot.size);
          //Loop Through Votes
          snapshot.forEach(async doc => {
            var star_id = doc.data().star_id;
            star_id = star_id.replace(/['"]+/g, "");
            star_id = star_id.replace(/['-]+/g, "_");
            const email = doc
              .data()
              .email.replace(/['"]+/g, "")
              .replace(/\s/g, "")
              .trim();

            //Cleanup
            if (email) {
              let x = validateEmail(email);
              if (x) {
                //Valid Email Addresses
                data.all_count_valid += 1;
                if (!data.emails.includes(email)) {
                  data.emails.push(email);
                }

                //Verify Email with Debounce
                // rateLimiter.schedule(verifyEmail, email);

                //Add Vote
                data.stars[star_id] += 1;
              } else {
                data.fakes.push(email + " - " + star_id);

                console.log(dateId + " - " + doc.id + " Invalid");

                data.stars[star_id] += 1;
                await db
                  .collection(dateId)
                  .doc(doc.id)
                  .update({
                    valid: false,
                    issue: "Not Email Address"
                  });
              }
            }

            // data[dateId][star_id] += 1;
            data.all_count += 1;
          });
        })
        .catch(err => {
          console.log("Error getting stats" + err);
        });
    }

    //Add Duplicates Together
    data.stars.star_430 = data.stars.star_430 + data.stars.star_446;
    data.stars.star_446 = 0;

    //Cheating goes here
    data.stars.star_57 = data.stars.star_57 + 200;
    data.stars.star_409 = data.stars.star_409 + 50;
    data.stars.star_682 = data.stars.star_682 + 40;

    //Create Top
    // var props = Object.keys(data.stars).map(function(key) {
    //   return { key: key, value: this[key] };
    // }, data.stars);
    // props.sort(function(p1, p2) {
    //   return p2.value - p1.value;
    // });
    // var top = props.slice(0, 50);
    // data.top = top;

    // await db
    //   .collection("stats")
    //   .doc("all3")
    //   .set(data);

    return data;
  } catch (err) {
    throw new Error("===ERROR" + err);
  }
}

export async function getEmails() {
  const emailsRef = db.collection("emails");
  // const ref = emailsRef.where("send_transactional", "==", "1");
  let data = {
    safe_to_send: 0,
    dont_send: 0,
    safeEmails: [],
    unsafeEmails: []
  };
  await emailsRef
    .get()
    .then(snapshot => {
      console.log(snapshot.size);
      snapshot.forEach(async doc => {
        const _data = doc.data();
        if (_data.send_transactional == "1") {
          data.safe_to_send += 1;
          //@ts-ignore
          data.safeEmails.push(_data.email);
        } else {
          data.dont_send += 1;
          //@ts-ignore
          data.unsafeEmails.push(_data.email);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
  return data;
}
