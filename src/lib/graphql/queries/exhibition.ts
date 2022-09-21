const query = `
query Exhibition($exhibitionId: String!) {
		exhibition(id: $exhibitionId) {
			exhibition {
				id
				name
				description
				url
				summaryText
				bodyText
				hashtags
				gallery {
					name
					slug
				}
				photographers {
					name
					slug
				}
				start
				end
				freeEntry
				online
				inPerson
			}
			error
		}
	}
`;

export default query;
