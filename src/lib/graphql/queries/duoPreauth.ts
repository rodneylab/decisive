const query = `
query Query {
	duoPreauth {
		result
		error
		devices {
			capabilities
			device
			type
		}
	}
}
`;

export default query;
