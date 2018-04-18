const dns = require('dns-socket');

DNSCAA = { };

DNSCAA.getDnsCaa = async function (domain, dnsServer = '8.8.8.8') {
	if (domain) {
		const result = await _checkDomain(domain.replace('*.', ''), dnsServer);
		return result;
	}
	else {
		return null;
	}
};

DNSCAA.validate = async function (domain, expectedCAAs, dnsServer = '8.8.8.8') {
	if (domain) {
		const dnsCaa = await DNSCAA.getDnsCaa(domain, dnsServer);

		let result = {
			hasDnsCaa: !!(dnsCaa && (dnsCaa.issue.length || dnsCaa.issuewild.length)),
			issue: [],
			issuewild: [],
		};

		if (expectedCAAs) {
			if (expectedCAAs.issue) {
				expectedCAAs.issue.forEach(function (expectedIssue) {
					result.issue.push({
						caa: expectedIssue,
						exists: (dnsCaa.issue.indexOf(expectedIssue) != -1)
					});
				});
			}

			if (expectedCAAs.issuewild) {
				expectedCAAs.issuewild.forEach(function (expectedIssuewild) {
					result.issuewild.push({
						caa: expectedIssuewild,
						exists: (dnsCaa.issuewild.indexOf(expectedIssuewild) != -1)
					});
				});
			}
		}

		return result;
	}
	else {
		return null;
	}
};

let _checkDomain = async function (domain, dnsServer) {
	let checkResult = await _query(domain, dnsServer);

	if (checkResult && checkResult.answers) {
		let result = {issue: [], issuewild: []};

		checkResult.answers.forEach(function (answer) {
			if (answer.data) {
				if (answer.data.tag === 'issue') {
					result.issue.push(answer.data.value);
				}
				else if (answer.data.tag === 'issuewild') {
					result.issuewild.push(answer.data.value);
				}
			}
		});

		return result;
	}
};

const _query = async function (domain, dnsServer) {
	const queryParams = {
		questions: [{
			type: 'CAA',
			name: domain
		}]
	};

	const promise = new Promise(resolve => {
		_queryAsync(queryParams, dnsServer, (result) => {
			resolve(result);
		});
	});

	const result = await promise;

	return result;
};

const _queryAsync = function (queryParams, dnsServer, callback) {
	let socket = dns();
	socket.query(queryParams, 53, dnsServer, (error, result) => {
		if (!error && result) {
			callback(result);
			socket.destroy();
		}
	});
};

module.exports = DNSCAA;