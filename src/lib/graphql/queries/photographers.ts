const query = `
query Photographers {
	photographers {
		photographers {
			name
			slug
			website
			websiteUrl
			id
		}
		hasMore
	}
}
`;

export default query;
