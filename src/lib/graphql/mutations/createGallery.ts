const query = `
mutation CreateGalleryMutation($createGalleryInput: CreateGalleryInput!) {
	createGallery(input: $createGalleryInput) {
		gallery {
			id
			name
			slug
			address
			openingTimes
			website
		}
		errors {
			field
			message
		}
	}
}
`;

export default query;
