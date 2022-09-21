const query = `
mutation DeleteTubeStationMutation($deleteTubeStationId: String!) {
	deleteTubeStation(id: $deleteTubeStationId)
}
`;

export default query;
