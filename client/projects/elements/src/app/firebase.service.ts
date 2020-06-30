import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { endpoints, baseUrl } from "./constants";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  stats: any;
  db: any;
  constructor(private http: HttpClient, afdb: AngularFirestore) {
    this.db = afdb;
  }

  public async getVotes() {
    //Get Analytics
    const statsDoc = this.db.doc("stats/all3");
    const statsObservable = statsDoc.valueChanges().pipe(
      map(function(stats: Object) {
        console.log(stats);
        return stats;
      })
    );

    return statsObservable.toPromise();
  }

  public async getStars(_query: string): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const endpoint = baseUrl + "/" + endpoints.stars + "/" + _query;
    return await this.http.post(endpoint, httpOptions).toPromise();
  }

  public async vote(data: Object): Promise<any> {
    const data2 = JSON.stringify(data);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    const endpoint = baseUrl + "/" + endpoints.vote;
    // let r = await this.http.post(endpoint, data2, httpOptions);
    const params: any = {
      headers: { "content-type": "application/json" },
      body: data2,
      method: "POST"
    };
    return fetch(endpoint, params);
    // .then(data => {
    //   return data.json();
    // })
    // .then(res => {
    //   console.log(res);
    // })
    // .catch(err => {
    //   console.log(err);
    // });
    // return r.toPromise();
  }
}
