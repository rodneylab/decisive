const query = `
mutation CreateExhibition($createExhibitionInput: CreateExhibitionInput!) {
	createExhibition(input: $createExhibitionInput) {
		exhibition {
			id
			name
			description
			summaryText
			hashtags
			gallery {
				name
				slug
			}
			start
			end
			freeEntry
			online
			inPerson
		}
		errors {
			field
			message
		}
	}
}
`;

export default query;
