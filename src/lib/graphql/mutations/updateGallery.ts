const query = `
mutation UpdateGalleryMutation($updateGalleryInput: UpdateGalleryInput!) {
	updateGallery(input: $updateGalleryInput) {
		gallery {
			id
			name
			slug
			address
			openingTimes
			openingTimes
			byAppointmentOpeningTimes
			website
			openStreetMap
		}
		errors {
			field
			message
		}
	}
}
`;

export default query;
