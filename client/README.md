# YdhApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Preparing SKUs for Shopify

- Copy / Paste SKU's by Release into CSV Table
- Make sure all mockups look good
- Fix Color and Size Names
- Sort A-Z
- (figure out 2nd images)

# How to Reconcile with Shopify

- Upload CSV to Shopify
- Copy Paste SKUS to Recocnile Table
- Use Insomnia Get YDH PRoducts Endpoint
- JSON \$.products[*].variants[*].sku
- Copy/Paste Endpoint results in Reconcile Table
