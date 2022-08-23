const query = `
query Query {
	fidoU2fBeginAuthenticate {
		labels
		signRequests {
			keyHandle
			challenge
			appId
			version
		}
		error
	}
}
`;

export default query;
