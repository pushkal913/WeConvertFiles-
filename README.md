# WeConvertFiles

[WeConvertFiles](https://www.weconvertfiles.com/) is a free collection of browser-based PDF, image, Office, data, and developer utilities maintained by [TechKnoGeeks](https://www.techknogeeks.com/).

Supported file processing runs locally in the browser, so file contents are not uploaded to WeConvertFiles for conversion. The platform does not require an account or payment information.

## Popular tools

- [Merge PDF](https://www.weconvertfiles.com/merge-pdf)
- [PDF to Word / TXT](https://www.weconvertfiles.com/pdf-to-word)
- [JPG to PDF](https://www.weconvertfiles.com/convert/jpg-to-pdf)
- [PDF to JPG](https://www.weconvertfiles.com/convert/pdf-to-jpg)
- [JSON Formatter and Validator](https://www.weconvertfiles.com/json-formatter)
- [JSON to YAML](https://www.weconvertfiles.com/json-yaml)
- [SQL Formatter](https://www.weconvertfiles.com/sql-formatter)

Browse the complete platform at [weconvertfiles.com](https://www.weconvertfiles.com/).

## Development

```powershell
npm.cmd ci
npm.cmd run generate:tools
npm.cmd run validate
```

The site is static and uses generated, route-specific HTML shells for tool metadata and canonicals while sharing the interactive application code through `app.js`.

## Privacy

Read the current [Privacy Policy](https://www.weconvertfiles.com/privacy). With consent, Zoho PageSense is used for behavioural analytics; the integration does not receive the contents of files selected for conversion.
