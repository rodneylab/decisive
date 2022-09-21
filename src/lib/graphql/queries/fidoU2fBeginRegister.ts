const query = `
query Query {
	fidoU2fBeginRegister {
		version
		appId
		challenge
	}
}
`;

export default query;
