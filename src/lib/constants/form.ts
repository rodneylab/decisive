import type { OpeningHoursRangeInput } from '$lib/generated/graphql';

export const DEFAULT_NEW_OPENING_HOURS: OpeningHoursRangeInput = {
	startDay: 0,
	endDay: 6,
	openingTime: '10:00',
	closingTime: '18:00'
};

export const PLACEHOLDER_TEXT = {
	fidoU2fLabel: 'Key label',
	galleryName: 'Gallery Name',
	openStreetMap: 'Map URL',
	photographerName: 'Photographer Name',
	slug: 'Slug',
	streetAddress: 'Street address',
	locality: 'District',
	city: 'Hope City',
	postalCode: 'W1A 1AA',
	country: 'New Land',
	tubeStationName: 'Station Name',
	username: 'user123',
	website: 'https://www.example.com/'
};

export const TITLE = {
	fidoU2fLabel: 'Label for key',
	galleryName: 'Gallery name',
	photographerName: 'Photographer name',
	openStreetMap: 'Map URL',
	slug: 's-l-u-g',
	streetAddress: 'Street address',
	locality: 'Locality',
	city: 'City',
	postalCode: 'Postal Code',
	country: 'Country',
	username: 'Username',
	tubeStationName: 'Station name',
	website: 'Website URL'
};
