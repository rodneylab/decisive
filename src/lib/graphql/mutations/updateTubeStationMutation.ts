const query = `
mutation UpdateTubeStationMutation($updateTubeStationInput: UpdateTubeStationInput!) {
	updateTubeStation(input: $updateTubeStationInput) {
		tubeStation {
			id
			name
			slug
		}
		errors {
			field
			message
		}
	}
}
`;

export default query;
