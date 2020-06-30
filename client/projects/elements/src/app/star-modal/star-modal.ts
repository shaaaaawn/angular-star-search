import {
  Component,
  OnInit,
  Input,
  Pipe,
  PipeTransform,
  ChangeDetectorRef
} from "@angular/core";
import { NgClass } from "@angular/common";
import { NgbActiveModal, NgbProgressbar } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "./../firebase.service";
import * as firebase from "firebase/app";
import { Observable, Subscriber } from "rxjs";
import { map, finalize, first, last } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  AngularFirestoreModule,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

export interface Star {
  id: string;
  status: string;
  image_url: string;
  dog_name: string;
  about_dog: string;
  insta: string;
  votes: number;
}

export interface Vote {
  uid: string;
  ip_address: string;
  email: string;
  star_id: string;
}

@Component({
  selector: "star-modal",
  templateUrl: "./star-modal.html",
  styleUrls: ["./star-modal.css", "./../media.css"]
})
export class StarModal implements OnInit {
  lineItems: any[];
  jsonRqst: any;
  stars: Star[];
  email: string;
  authenticated: boolean = false;
  voting_live = true;
  showEmail: boolean = false;
  loadingVote: boolean = false;
  message: string | undefined;
  // votes: any;
  db: any;
  starId;
  statsSubscriber: any;
  stats2: any;
  statsDoc: any;
  // status: string = 'Contestant';

  voteFormControls = {
    email: new FormControl("", {
      updateOn: "blur",
      validators: [Validators.email]
    })
  };
  newVote: any;
  voted = true;
  voteForm: FormGroup = new FormGroup(this.voteFormControls);
  @Input() public star: Star | undefined;
  @Input() public all_stars: any | undefined;
  @Input() public stats: Observable<any> | undefined;
  @Input() public status: string;

  constructor(
    public activeModal: NgbActiveModal,
    private firebaseS: FirebaseService,
    private afdb: AngularFirestore
  ) {
    this.activeModal = activeModal;
    this.db = afdb;
  }
  async ngOnInit() {
    await this.init(this.star.id);
  }

  async init(_starId: string) {
    console.log(_starId);
    this.starId = this.star.id.replace(/['-]+/g, "_");
    // this.stats.pipe().subscribe((_stats: any | undefined) => {
    //   this.star.votes = _stats.stars[this.starId];
    //   // console.log(_stats);
    // });
  }

  async vote() {
    this.loadingVote = true;
    this.message = "Voting..";
    const data = {
      email: this.email,
      star_id: this.star.id,
      date: new Date()
    };
    await this.firebaseS
      .vote(data)
      .then(res => {
        const data = res.json();
        data.then(__res => {
          this.message = __res.message;
          this.showEmail = false;
          // this.star.votes += 1;
          this.loadingVote = false;
          this.voted = true;
        });
      })
      .catch(err => {
        console.log(err);
        this.loadingVote = false;
        this.voted = false;
        this.message = "Error :(";
      });
  }
  async checkVoter() {
    if (this.showEmail) {
      console.log(this.voteFormControls.email.valid);
      if (!this.voteFormControls.email.valid) {
        this.message = "Enter Valid Email";
      } else {
        this.email = this.voteFormControls.email.value || "";
        this.vote();
      }
    }
    if (!this.email) {
      this.showEmail = true;
    }
    if (this.email) {
      this.vote();
    }
  }

  async nextStar() {
    this.reset();
    //Get Next Star
    const random = Math.floor(
      Math.random() * (this.all_stars.length + 200 - 1) + 1
    );
    const nextId = "star-" + random;
    const star = this.all_stars.find(x => x.id === nextId);
    if (star) {
      this.star = star;
      this.init(this.star.id);
      this.voted = false;
    } else {
      console.log("not found");
      this.nextStar();
    }
  }
  async reset() {
    //Reset Vote To Enable
    this.loadingVote = false;
    this.message = null;
    //Hide Image
    this.star.dog_name = null;
    this.star.about_dog = null;
    this.star.votes = null;
  }
}
