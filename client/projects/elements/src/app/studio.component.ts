import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  Renderer2
} from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { FirebaseService } from "./firebase.service";
import { endpoints } from "./constants";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from "@angular/animations";
import { StarModal } from "./star-modal/star-modal";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { map, finalize } from "rxjs/operators";
import { Observable, Subscriber } from "rxjs";
import * as firebase from "firebase/app";

export interface Star {
  id: string;
  status: string;
  image_url: string;
  dog_name: string;
  about_dog: string;
  insta: string;
  votes: number;
}

@Component({
  selector: "app-studio",
  templateUrl: "./studio.component.html",
  styleUrls: ["./studio.component.css", "./media.css"],
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        // each time the binding value changesd
        query(
          ":enter",
          [stagger(100, [animate("0.5s", style({ opacity: 0 }))])],
          { optional: true }
        ),
        query(
          ":leave",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("0.5s", style({ opacity: 1 }))])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class StudioComponent implements OnInit {
  config: any;
  db: any;
  // firebaseService: FirebaseService;
  router: any;
  task: any;
  ref: any;

  availableGarments: any | undefined;
  selectedGraphicElement: Element;
  selectedStar: Star;

  loadingStars: boolean = true;
  loadingGif = endpoints.gifs.loading;
  stars: Star[];
  starsAll: Star[];
  winners: Star[];
  hash: string;
  initial = 40;
  bottom = 0;
  stats: any;
  moreStarsAvailable = true;
  statsDoc: any;

  @HostListener("window:resize") onResize() {
    console.log("resize");
    // this.resizeAllMasonryItems();
  }

  @ViewChild("starModal", { static: true }) starModalElement: ElementRef;

  constructor(
    private firebaseService: FirebaseService,
    private modalService: NgbModal,
    private afdb: AngularFirestore
  ) {
    this.db = afdb;
    //Get Analytics
    this.statsDoc = this.db.doc("stats/all3");
    this.stats = this.statsDoc.valueChanges();

    //Get Stars
    this.firebaseService.getStars("All").then((_stars: Star[]) => {
      this.starsAll = _stars;
      this.stars = this.shuffle(_stars);
      console.log(this.starsAll.length);
      if (window.location.hash) {
        this.hash = window.location.hash.substring(1);
        var star = this.starsAll.find(x => x.id == this.hash);
        if (star) {
          this.openStar(star, "Contestant");
          this.initial = 12;
          this.loadStars();
        } else {
          this.loadStars();
        }
      } else {
        this.loadStars();
      }
    });
    //Get Winners
    this.firebaseService.getStars("Winners").then((_stars: Star[]) => {
      this.winners = _stars;
    });
  }

  async ngOnInit() {}

  async ngAfterViewInit() {
    // await this.resizeAllMasonryItems();
  }
  async shuffleMore() {
    this.stars = this.shuffle(this.stars);
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  async loadStars() {
    this.loadingStars = true;
    this.stars = this.starsAll.slice(0, this.initial);
    setTimeout(() => {
      this.resizeAllMasonryItems();
      this.waitForImages();
    }, 1000);
    this.loadingStars = false;
  }

  async loadMore() {
    this.loadingStars = true;
    this.initial = this.initial + 100;
    this.stars = await this.starsAll.slice(this.bottom, this.initial);
    setTimeout(async () => {
      await this.resizeAllMasonryItems();
      await this.waitForImages();
    }, 1000);
    if (this.initial > 200) {
      this.moreStarsAvailable = false;
    }
    this.loadingStars = false;
  }

  openStar(_star, _status) {
    var printModal = this.modalService.open(StarModal, {
      windowClass: "star-modal",
      size: "lg",
      centered: false,
      backdropClass: "star-backdrop"
    });
    printModal.componentInstance.star = _star;
    printModal.componentInstance.all_stars = this.starsAll;
    printModal.componentInstance.stats = this.stats;
    printModal.componentInstance.status = _status;
  }

  async selectStar(_star, _status) {
    this.selectedStar = _star;
    this.openStar(_star, _status);
  }

  public async resizeMasonryItem(item) {
    /* Get the grid object, its row-gap, and the size of its implicit rows */
    var grid = document.getElementsByClassName("masonry")[0];
    if (grid) {
      var rowGap = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
        ),
        rowHeight = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
        ),
        gridImagesAsContent = item.querySelector("img.masonry-content");
      const itemHeight = item
        .querySelector(".masonry-content")
        .getBoundingClientRect().height;
      const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));

      item.style.gridRowEnd = "span " + rowSpan;
      if (gridImagesAsContent) {
        item.querySelector("img.masonry-content").style.height =
          item.getBoundingClientRect().height + "px";
      }
    }
  }

  async resizeAllMasonryItems() {
    const allItems = document.querySelectorAll(".masonry-item");
    if (allItems) {
      for (let i = 0; i > allItems.length; i++) {
        await this.resizeMasonryItem(allItems[i]);
      }
    }
  }

  async waitForImages() {
    const allItems = await document.querySelectorAll(".masonry-item");
    const imagesLoaded = require("imagesloaded");

    const _this = this;
    if (allItems) {
      for (let i = 0; i < allItems.length; i++) {
        imagesLoaded(allItems[i], function(instance) {
          setTimeout(() => {
            const item = instance.elements[0];
            item.h = instance.images[0].height;
            _this.resizeMasonryItem(item);
          }, 300);
        });
      }
    }
  }
}
