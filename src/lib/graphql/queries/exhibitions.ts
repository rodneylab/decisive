const query = `
query Exhibitions {
		exhibitions {
			exhibitions {
				id
				name
				start
				end
				freeEntry
				online
				inPerson
				gallery {
					name
					slug
				}
				photographers {
					name
					slug
				}
				hashtags
			}
		}
	}
`;

export default query;
