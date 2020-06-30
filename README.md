<p style="text-align:center">
<img style="width: 400px" src="https://firebasestorage.googleapis.com/v0/b/shaaaaaaawn.appspot.com/o/cdn%2Fstar-search-screen.png?alt=media&token=99fb125c-78ba-442d-81b0-c1aa6157d02a" />
</p>

## Description

'Star Search' Vote to Win Campaign Built with Angular Elements, Airtable, and Firebase. Meant to be embedded in a CMS such as Shopify. Uses Debounce to verify email addresses to prevent fake entries.

## Configuration

- Generate service account fromm firebase and place in functions folder / Add to .env file
- Create Airtable Base and copy API Key and BASE to .env file
- Generate API Key from Debounce and copy .env file

## Installation

```bash
#Angular Client
$ cd client && npm install
#Firebase Functions
$ cd functions && npm install
```

## Run Application

```bash
#Angular Client
$ cd client && ng serve elements
#Firebase Functions
$ cd functions && npm run functions
```

## Deploy & Embed WIth Angular Elements

```bash
#Angular Client
$ cd client && npm run build:elements
#Firebase Functions
$ cd functions && npm run deploy
```
