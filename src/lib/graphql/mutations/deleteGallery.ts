const query = `
mutation DeleteGalleryMutation($deleteGalleryId: String!) {
	deleteGallery(id: $deleteGalleryId)
}
`;

export default query;
