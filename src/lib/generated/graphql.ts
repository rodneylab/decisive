// import type {} from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
	DateTime: any;
};

export type AddressInput = {
	city?: InputMaybe<Scalars['String']>;
	country?: InputMaybe<Scalars['String']>;
	locality?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	streetAddress: Scalars['String'];
};

export type CreateExhibitionInput = {
	bodyText: Scalars['String'];
	description: Scalars['String'];
	end: Scalars['String'];
	freeEntry: Scalars['Boolean'];
	gallery: Scalars['String'];
	hashtags?: InputMaybe<Array<Scalars['String']>>;
	inPerson: Scalars['Boolean'];
	name: Scalars['String'];
	online: Scalars['Boolean'];
	start: Scalars['String'];
	summaryText: Scalars['String'];
	url: Scalars['String'];
};

export type CreateExhibitionResponse = {
	__typename?: 'CreateExhibitionResponse';
	errors?: Maybe<Array<FieldError>>;
	exhibition?: Maybe<Exhibition>;
};

export type CreateGalleryInput = {
	googleMap?: InputMaybe<Scalars['String']>;
	name: Scalars['String'];
	nearestTubes?: InputMaybe<Array<Scalars['String']>>;
	openStreetMapUrl?: InputMaybe<Scalars['String']>;
	openingHours?: InputMaybe<OpeningHoursInput>;
	postalAddress?: InputMaybe<AddressInput>;
	slug: Scalars['String'];
	website?: InputMaybe<Scalars['String']>;
};

export type CreateGalleryResponse = {
	__typename?: 'CreateGalleryResponse';
	errors?: Maybe<Array<FieldError>>;
	gallery?: Maybe<Gallery>;
};

export type CreatePhotographerInput = {
	firstName?: InputMaybe<Scalars['String']>;
	lastName?: InputMaybe<Scalars['String']>;
	otherNames?: InputMaybe<Scalars['String']>;
	slug: Scalars['String'];
	website?: InputMaybe<Scalars['String']>;
};

export type CreatePhotographerResponse = {
	__typename?: 'CreatePhotographerResponse';
	errors?: Maybe<Array<FieldError>>;
	photographer?: Maybe<Photographer>;
};

export type CreateTubeStationInput = {
	name: Scalars['String'];
	slug: Scalars['String'];
};

export type CreateTubeStationResponse = {
	__typename?: 'CreateTubeStationResponse';
	errors?: Maybe<Array<FieldError>>;
	tubeStation?: Maybe<TubeStation>;
};

export type DuoAuthDevice = {
	__typename?: 'DuoAuthDevice';
	capabilities: Array<Scalars['String']>;
	device: Scalars['String'];
	type: Scalars['String'];
};

export type DuoEnrollResponse = {
	__typename?: 'DuoEnrollResponse';
	activationCode?: Maybe<Scalars['String']>;
	error?: Maybe<Scalars['String']>;
	qrCode?: Maybe<Scalars['String']>;
};

export type DuoEnrollStatusResponse = {
	__typename?: 'DuoEnrollStatusResponse';
	error?: Maybe<Scalars['String']>;
	result?: Maybe<Scalars['String']>;
};

export type DuoPreauthResponse = {
	__typename?: 'DuoPreauthResponse';
	devices?: Maybe<Array<DuoAuthDevice>>;
	error?: Maybe<Scalars['String']>;
	result?: Maybe<Scalars['String']>;
};

export type Exhibition = {
	__typename?: 'Exhibition';
	bodyText?: Maybe<Scalars['String']>;
	createdAt: Scalars['DateTime'];
	description?: Maybe<Scalars['String']>;
	end?: Maybe<Scalars['String']>;
	freeEntry: Scalars['Boolean'];
	gallery?: Maybe<Gallery>;
	hashtags?: Maybe<Array<Scalars['String']>>;
	id: Scalars['String'];
	inPerson: Scalars['Boolean'];
	name: Scalars['String'];
	online: Scalars['Boolean'];
	photographers?: Maybe<Array<Photographer>>;
	start?: Maybe<Scalars['String']>;
	summaryText?: Maybe<Scalars['String']>;
	updatedAt: Scalars['DateTime'];
	url?: Maybe<Scalars['String']>;
};

export type ExhibitionQueryResponse = {
	__typename?: 'ExhibitionQueryResponse';
	error?: Maybe<Scalars['String']>;
	exhibition?: Maybe<Exhibition>;
};

export type FidoU2fAuthenticateRequest = {
	__typename?: 'FidoU2fAuthenticateRequest';
	error?: Maybe<Scalars['String']>;
	labels?: Maybe<Array<Scalars['String']>>;
	signRequests?: Maybe<Array<FidoU2fSignRequest>>;
};

export type FidoU2fRegisterInput = {
	label: Scalars['String'];
	registerData: FidoU2fRegistrationDataInput;
};

export type FidoU2fRegisterRequest = {
	__typename?: 'FidoU2fRegisterRequest';
	appId: Scalars['String'];
	challenge: Scalars['String'];
	version: Scalars['String'];
};

export type FidoU2fRegistrationDataInput = {
	clientData: Scalars['String'];
	registrationData: Scalars['String'];
	version: Scalars['String'];
};

export type FidoU2fSignRequest = {
	__typename?: 'FidoU2fSignRequest';
	appId: Scalars['String'];
	challenge: Scalars['String'];
	keyHandle: Scalars['String'];
	version: Scalars['String'];
};

export type FidoU2fSignResponseInput = {
	clientData: Scalars['String'];
	keyHandle: Scalars['String'];
	signatureData: Scalars['String'];
};

export type FieldError = {
	__typename?: 'FieldError';
	field: Scalars['String'];
	message: Scalars['String'];
};

export type Gallery = {
	__typename?: 'Gallery';
	address?: Maybe<Scalars['String']>;
	byAppointmentOpeningHours?: Maybe<OpeningHours>;
	byAppointmentOpeningTimes?: Maybe<Scalars['String']>;
	createdAt: Scalars['DateTime'];
	exhibitions?: Maybe<Array<Exhibition>>;
	googleMap?: Maybe<Scalars['String']>;
	id: Scalars['String'];
	location?: Maybe<Location>;
	name: Scalars['String'];
	nearestTubes?: Maybe<Array<TubeStation>>;
	openStreetMap?: Maybe<Scalars['String']>;
	openingHours?: Maybe<OpeningHours>;
	openingTimes?: Maybe<Scalars['String']>;
	postalAddress?: Maybe<PostalAddress>;
	slug: Scalars['String'];
	tubes?: Maybe<Scalars['String']>;
	updatedAt: Scalars['DateTime'];
	website?: Maybe<Scalars['String']>;
	websiteUrl?: Maybe<Scalars['String']>;
};

export type GalleryQueryResponse = {
	__typename?: 'GalleryQueryResponse';
	error?: Maybe<Scalars['String']>;
	gallery?: Maybe<Gallery>;
};

export type Location = {
	__typename?: 'Location';
	latitude: Scalars['Float'];
	longitude: Scalars['Float'];
};

export type LoginInput = {
	password: Scalars['String'];
	username: Scalars['String'];
};

export type Mutation = {
	__typename?: 'Mutation';
	createExhibition: CreateExhibitionResponse;
	createGallery: CreateGalleryResponse;
	createPhotographer: CreatePhotographerResponse;
	createTubeStation: CreateTubeStationResponse;
	deleteGallery: Scalars['Boolean'];
	deleteTubeStation: Scalars['Boolean'];
	duoAuth: Scalars['Boolean'];
	duoEnroll: DuoEnrollResponse;
	fidoU2fAuthenticate: Scalars['Boolean'];
	fidoU2fCompleteAuthentication: Scalars['Boolean'];
	fidoU2fRegister: Scalars['Boolean'];
	login: UserResponse;
	logout: Scalars['Boolean'];
	register: UserResponse;
	updateExhibition: CreateExhibitionResponse;
	updateGallery: CreateGalleryResponse;
	updateTubeStation: CreateTubeStationResponse;
};

export type MutationCreateExhibitionArgs = {
	input: CreateExhibitionInput;
};

export type MutationCreateGalleryArgs = {
	input: CreateGalleryInput;
};

export type MutationCreatePhotographerArgs = {
	input: CreatePhotographerInput;
};

export type MutationCreateTubeStationArgs = {
	input: CreateTubeStationInput;
};

export type MutationDeleteGalleryArgs = {
	id: Scalars['String'];
};

export type MutationDeleteTubeStationArgs = {
	id: Scalars['String'];
};

export type MutationDuoAuthArgs = {
	device: Scalars['String'];
};

export type MutationFidoU2fAuthenticateArgs = {
	registerInput: FidoU2fRegisterInput;
};

export type MutationFidoU2fCompleteAuthenticationArgs = {
	signData: FidoU2fSignResponseInput;
};

export type MutationFidoU2fRegisterArgs = {
	registerInput: FidoU2fRegisterInput;
};

export type MutationLoginArgs = {
	credentials: LoginInput;
};

export type MutationRegisterArgs = {
	registerInput: UsernameEmailPasswordInput;
};

export type MutationUpdateExhibitionArgs = {
	input: UpdateExhibitionInput;
};

export type MutationUpdateGalleryArgs = {
	input: UpdateGalleryInput;
};

export type MutationUpdateTubeStationArgs = {
	input: UpdateTubeStationInput;
};

export type OpeningHours = {
	__typename?: 'OpeningHours';
	openingHoursRanges?: Maybe<Array<OpeningHoursRange>>;
};

export type OpeningHoursInput = {
	openingHoursRanges?: InputMaybe<Array<OpeningHoursRangeInput>>;
};

export type OpeningHoursRange = {
	__typename?: 'OpeningHoursRange';
	closingTime: Scalars['String'];
	createdAt: Scalars['DateTime'];
	endDay: Scalars['Float'];
	id: Scalars['Float'];
	openingTime: Scalars['String'];
	startDay: Scalars['Float'];
	updatedAt: Scalars['DateTime'];
};

export type OpeningHoursRangeInput = {
	closingTime: Scalars['String'];
	endDay: Scalars['Float'];
	openingTime: Scalars['String'];
	startDay: Scalars['Float'];
};

export type PaginatedExhibitions = {
	__typename?: 'PaginatedExhibitions';
	exhibitions: Array<Exhibition>;
	hasMore: Scalars['Boolean'];
};

export type PaginatedGalleries = {
	__typename?: 'PaginatedGalleries';
	galleries: Array<Gallery>;
	hasMore: Scalars['Boolean'];
};

export type PaginatedPhotographers = {
	__typename?: 'PaginatedPhotographers';
	hasMore: Scalars['Boolean'];
	photographers: Array<Photographer>;
};

export type Photographer = {
	__typename?: 'Photographer';
	createdAt: Scalars['DateTime'];
	exhibitions?: Maybe<Array<Exhibition>>;
	firstName?: Maybe<Scalars['String']>;
	id: Scalars['String'];
	lastName?: Maybe<Scalars['String']>;
	name: Scalars['String'];
	otherNames?: Maybe<Scalars['String']>;
	slug: Scalars['String'];
	updatedAt: Scalars['DateTime'];
	website?: Maybe<Scalars['String']>;
	websiteUrl?: Maybe<Scalars['String']>;
};

export type PhotographerQueryResponse = {
	__typename?: 'PhotographerQueryResponse';
	error?: Maybe<Scalars['String']>;
	photographer?: Maybe<Photographer>;
};

export type PostalAddress = {
	__typename?: 'PostalAddress';
	city?: Maybe<Scalars['String']>;
	country: Scalars['String'];
	createdAt: Scalars['DateTime'];
	id: Scalars['Float'];
	locality?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	streetAddress: Scalars['String'];
	updatedAt: Scalars['DateTime'];
};

export type Query = {
	__typename?: 'Query';
	duoCheck: Scalars['Boolean'];
	duoEnrollStatus: DuoEnrollStatusResponse;
	duoPing: Scalars['Boolean'];
	duoPreauth: DuoPreauthResponse;
	exhibition: ExhibitionQueryResponse;
	exhibitions: PaginatedExhibitions;
	fidoU2fBeginAuthenticate?: Maybe<FidoU2fAuthenticateRequest>;
	fidoU2fBeginRegister?: Maybe<FidoU2fRegisterRequest>;
	galleries: PaginatedGalleries;
	gallery: GalleryQueryResponse;
	hello: Scalars['String'];
	me?: Maybe<User>;
	photographer: PhotographerQueryResponse;
	photographers: PaginatedPhotographers;
	tubeStation: TubeStationQueryResponse;
	tubeStations: Array<TubeStation>;
};

export type QueryDuoEnrollStatusArgs = {
	activationCode: Scalars['String'];
};

export type QueryExhibitionArgs = {
	id: Scalars['String'];
};

export type QueryGalleryArgs = {
	slug: Scalars['String'];
};

export type QueryPhotographerArgs = {
	slug: Scalars['String'];
};

export type QueryTubeStationArgs = {
	slug: Scalars['String'];
};

export type TubeStation = {
	__typename?: 'TubeStation';
	createdAt: Scalars['DateTime'];
	galleries?: Maybe<Array<Gallery>>;
	id: Scalars['String'];
	name: Scalars['String'];
	slug: Scalars['String'];
	updatedAt: Scalars['DateTime'];
};

export type TubeStationQueryResponse = {
	__typename?: 'TubeStationQueryResponse';
	error?: Maybe<Scalars['String']>;
	tubeStation?: Maybe<TubeStation>;
};

export type UpdateExhibitionInput = {
	addPhotographers?: InputMaybe<Array<Scalars['String']>>;
	bodyText?: InputMaybe<Scalars['String']>;
	id: Scalars['String'];
	name?: InputMaybe<Scalars['String']>;
	removePhotographers?: InputMaybe<Array<Scalars['String']>>;
	summaryText?: InputMaybe<Scalars['String']>;
	url?: InputMaybe<Scalars['String']>;
};

export type UpdateGalleryInput = {
	addNearestTubes?: InputMaybe<Array<Scalars['String']>>;
	id: Scalars['String'];
	name?: InputMaybe<Scalars['String']>;
	openStreetMapUrl?: InputMaybe<Scalars['String']>;
	postalAddress?: InputMaybe<AddressInput>;
	removeNearestTubes?: InputMaybe<Array<Scalars['String']>>;
	replacementByAppointmentOpeningHours?: InputMaybe<OpeningHoursInput>;
	replacementOpeningHours?: InputMaybe<OpeningHoursInput>;
	slug?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
};

export type UpdateTubeStationInput = {
	id: Scalars['String'];
	name?: InputMaybe<Scalars['String']>;
	slug?: InputMaybe<Scalars['String']>;
};

export type User = {
	__typename?: 'User';
	createdAt: Scalars['String'];
	duoRegistered: Scalars['Boolean'];
	email: Scalars['String'];
	fidoU2fRegistered: Scalars['Boolean'];
	id: Scalars['String'];
	updatedAt: Scalars['String'];
	username: Scalars['String'];
};

export type UserResponse = {
	__typename?: 'UserResponse';
	errors?: Maybe<Array<FieldError>>;
	user?: Maybe<User>;
};

export type UsernameEmailPasswordInput = {
	email: Scalars['String'];
	password: Scalars['String'];
	username: Scalars['String'];
};
