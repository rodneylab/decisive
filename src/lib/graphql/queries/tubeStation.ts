const query = `
query Query($tubeStationSlug: String!) {
	tubeStation(slug: $tubeStationSlug) {
		tubeStation {
			name
			slug
			id
		}
		error
	}
}
`;

export default query;
