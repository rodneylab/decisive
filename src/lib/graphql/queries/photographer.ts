const query = `
query PhotographerQuery($photographerQuerySlug: String!) {
	photographer(slug: $photographerQuerySlug) {
		photographer {
			name
			slug
			website
			websiteUrl
			exhibitions {
				id
				name
			}
			id
		}
	}
}
`;

export default query;
