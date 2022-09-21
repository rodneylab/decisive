const query = `
mutation CreateTubeStationMutation($createTubeStationInput: CreateTubeStationInput!) {
	createTubeStation(input: $createTubeStationInput) {
		errors {
			field
			message
		}
		tubeStation {
			id
			name
			slug
		}
	}
}
`;

export default query;
