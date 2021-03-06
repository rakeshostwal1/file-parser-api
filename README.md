# file-parser-api
A Utility to parse Doc, Text, CSV Or PDF file, parse selective columns and return back parsed data as a list

## Project setup
```
npm install
```

### Compiles and load for development
```
npm start
```

## How to Use
The `/api/parseFile` accepts any of Doc, Text, CSV Or PDF files. The first line of the file should have a header and data should be separated by `,`.

`/api/parseFile` is a `POST` API and accepts input in `file` parameter.

Any file uploaded other than Doc, Text, CSV Or PDF files format will return empty response