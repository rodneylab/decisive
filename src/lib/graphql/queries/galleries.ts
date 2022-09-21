const query = `
query Query {
	galleries {
		galleries {
			id
			name
			slug
			address
			openingTimes
			byAppointmentOpeningTimes
			website
		}
		hasMore
	}
}
`;

export default query;
