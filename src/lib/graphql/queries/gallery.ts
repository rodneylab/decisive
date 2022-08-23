const query = `
query GalleryQuery($galleryQuerySlug: String!) {
	gallery(slug: $galleryQuerySlug) {
		gallery {
			id
			name
			slug
			address
			postalAddress {
				streetAddress
				locality
				city
				postalCode
				country
			}
			openingTimes
			openingHours {
				openingHoursRanges {
					id
					startDay
					endDay
					openingTime
					closingTime
				}
			}
			byAppointmentOpeningTimes
			byAppointmentOpeningHours {
				openingHoursRanges {
					id
					startDay
					endDay
					openingTime
					closingTime
				}
			}
			exhibitions {
				name
				id
				start
				end
			}
			website
			websiteUrl
			nearestTubes {
				name
			}
			openStreetMap
			location {
				latitude
				longitude
			}
		}
	}
}
`;

export default query;
