// Core
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { createCustomElement } from "@angular/elements";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Firebase
import { AngularFireModule } from "@angular/fire/";
import {
  AngularFirestoreModule,
  AngularFirestore
} from "@angular/fire/firestore";
import { environment } from "../environments/environment";

// Components
import { StudioComponent } from "./studio.component";
import { StarModal } from "./star-modal/star-modal";

// Add ons
import {
  MatDialogModule,
  MatInputModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from "@angular/material";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [StudioComponent, StarModal],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 600 } },
    AngularFirestore
  ],
  bootstrap: [StudioComponent],
  entryComponents: [StudioComponent, StarModal]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const studio = createCustomElement(StudioComponent, {
      injector: this.injector
    });
    customElements.define("star-search", studio);
  }
}
