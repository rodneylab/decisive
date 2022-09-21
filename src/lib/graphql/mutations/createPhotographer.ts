const query = `
mutation CreatePhotographer($createPhotographerInput: CreatePhotographerInput!) {
		createPhotographer(input: $createPhotographerInput) {
			errors {
				field
				message
			}
			photographer {
				id
				name
				slug
				website
				websiteUrl
			}
		}
	}
`;

export default query;
