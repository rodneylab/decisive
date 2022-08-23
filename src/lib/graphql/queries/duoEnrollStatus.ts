const query = `
		query Query($duoEnrollStatusActivationCode: String!) {
			duoEnrollStatus(activationCode: $duoEnrollStatusActivationCode) {
				result
				error
			}
		}
`;

export default query;
