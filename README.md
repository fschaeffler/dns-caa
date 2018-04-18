# DNS CAA

This npm-packages checks for the existance of the security-feature DNS CAA.

## Installation

`npm install dns-caa --save`

## Usage

- when the term `issue` is being used, it's a single domain certificates.
- when the term `issuewild` is being used, it's for wildcard certficates

### DNSCAA.getDnsCaa = async function (domain, dnsServer = '8.8.8.8')

```
const DNSCAA = require('dns-caa');

let _getGoogleDnsCaa = async function () {
	let checkResult = await DNSCAA.getDnsCaa('google.com');
	console.log(checkResult);
};

let _getGoogleDnsCaaDnsServer = async function () {
	let checkResult = await DNSCAA.getDnsCaa('google.com', 8.8.4.4);
	console.log(checkResult);
};

// retrieve DNS-CAA for google.com via the default DNS-Server 8.8.8.8
_getGoogleDnsCaa();

// retrieve DNS-CAA for google.com from DNS-Server 8.8.4.4
_getGoogleDnsCaa();

```

output:
```
{
	issue: [ 'pki.goog' ],
	issuewild: []
}
```

### DNSCAA.validate = async function (domain, expectedCAAs, dnsServer = '8.8.8.8')

```
const DNSCAA = require('dns-caa');

let _getGoogleValidation = async function () {
	let checkResult = await DNSCAA.validate('google.com', {issue: ['google.de', 'pki.goog']});
	console.log(checkResult);
};

// check fi google.com has the entries google.de and pki.goog as valid CAA-records
_getGoogleValidation();
```

output:
```
{
	hasDnsCaa: true,
	issue: [
		{ caa: 'google.de', exists: false },
		{ caa: 'pki.goog', exists: true }
	],
	issuewild: []
}
```