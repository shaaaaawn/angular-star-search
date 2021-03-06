// // @angular
// import { NgModule } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import { RouterModule, Routes } from "@angular/router";

// /* Services */
// import { AuthGuard } from "./core/auth-guard.service";
// import { RoleGuard } from "./core/role-guard.service";

// // Compnents & Modules
// import { HomeComponent } from "./home/home.component";
// import {
//   StudioComponent,
//   StudioComponentStepper
// } from "./studio/studio.component";
// import { Error404Component } from "./error404/error404.component";
// import { UploadComponent } from "./upload/upload.component";

// // Components
// import { LoginComponent } from "./auth/login/login.component";
// import { RegisterComponent } from "./auth/register/register.component";
// import { RequestPasswordComponent } from "./auth/request-password/request-password.component";
// import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";

// const routes = [
//   { path: "", component: StudioComponent },
//   { path: "login", component: LoginComponent },
//   { path: "register", component: RegisterComponent, canActivate: [AuthGuard] },
//   // { path: "doggiedoor", component: WelcomeComponent },
//   { path: "request-password", component: RequestPasswordComponent },
//   { path: "reset-password", component: ResetPasswordComponent },
//   {
//     path: "upload/:id",
//     component: UploadComponent
//   },
//   {
//     path: "upload",
//     component: UploadComponent
//   },
//   {
//     path: "studio",
//     component: StudioComponent
//   },
//   {
//     path: "studio/:id",
//     component: StudioComponentStepper
//   },
//   {
//     path: "admin",
//     loadChildren: () =>
//       import("./admin/admin.module").then(mod => mod.AdminModule),
//     canActivate: [AuthGuard]
//   },
//   { path: "**", component: Error404Component }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}
