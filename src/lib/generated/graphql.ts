import type { ApolloQueryResult, ObservableQuery, WatchQueryOptions } from '@apollo/client';
import gql from 'graphql-tag';
import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';
import client from 'undefined';
export type Maybe<T> = T | null;
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
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  locality?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  streetAddress: Scalars['String'];
};

export type CreateGalleryInput = {
  googleMap?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  nearestTubes?: Maybe<Array<Scalars['String']>>;
  openingHours?: Maybe<OpeningHoursInput>;
  postalAddress?: Maybe<AddressInput>;
  slug: Scalars['String'];
  website?: Maybe<Scalars['String']>;
};

export type CreateGalleryResponse = {
  __typename?: 'CreateGalleryResponse';
  errors?: Maybe<Array<FieldError>>;
  gallery?: Maybe<Gallery>;
};

export type CreateTubeStationResponse = {
  __typename?: 'CreateTubeStationResponse';
  errors?: Maybe<Array<FieldError>>;
  tubeStation?: Maybe<TubeStation>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Gallery = {
  __typename?: 'Gallery';
  address?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  googleMap?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  nearestTubes?: Maybe<Array<TubeStation>>;
  openingHours?: Maybe<OpeningHours>;
  openingTimes?: Maybe<Scalars['String']>;
  postalAddress?: Maybe<PostalAddress>;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  website?: Maybe<Scalars['String']>;
};

export type GalleryQueryResponse = {
  __typename?: 'GalleryQueryResponse';
  error?: Maybe<Scalars['String']>;
  gallery?: Maybe<Gallery>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createGallery: CreateGalleryResponse;
  createTubeStation: CreateTubeStationResponse;
  deleteGallery: Scalars['Boolean'];
  deleteTubeStation: Scalars['Boolean'];
};

export type MutationCreateGalleryArgs = {
  input: CreateGalleryInput;
};

export type MutationCreateTubeStationArgs = {
  name: Scalars['String'];
};

export type MutationDeleteGalleryArgs = {
  id: Scalars['String'];
};

export type MutationDeleteTubeStationArgs = {
  id: Scalars['String'];
};

export type OpeningHours = {
  __typename?: 'OpeningHours';
  openingHoursRanges?: Maybe<Array<OpeningHoursRange>>;
};

export type OpeningHoursInput = {
  openingHoursRanges?: Maybe<Array<OpeningHoursRangeInput>>;
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

export type PaginatedGalleries = {
  __typename?: 'PaginatedGalleries';
  galleries: Array<Gallery>;
  hasMore: Scalars['Boolean'];
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
  galleries: PaginatedGalleries;
  gallery: GalleryQueryResponse;
  hello: Scalars['String'];
  tubeStations: Array<TubeStation>;
};

export type QueryGalleryArgs = {
  slug: Scalars['String'];
};

export type TubeStation = {
  __typename?: 'TubeStation';
  createdAt: Scalars['DateTime'];
  galleries?: Maybe<Array<Gallery>>;
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type TubeStationsQueryVariables = Exact<{ [key: string]: never }>;

export type TubeStationsQuery = {
  __typename?: 'Query';
  tubeStations: Array<{
    __typename?: 'TubeStation';
    id: string;
    createdAt: any;
    updatedAt: any;
    name: string;
  }>;
};

export const TubeStationsDoc = gql`
  query TubeStations {
    tubeStations {
      id
      createdAt
      updatedAt
      name
    }
  }
`;
export const TubeStations = (
  options: Omit<WatchQueryOptions<TubeStationsQueryVariables>, 'query'>
): Readable<
  ApolloQueryResult<TubeStationsQuery> & {
    query: ObservableQuery<TubeStationsQuery, TubeStationsQueryVariables>;
  }
> => {
  const q = client.watchQuery({
    query: TubeStationsDoc,
    ...options
  });
  var result = readable<
    ApolloQueryResult<TubeStationsQuery> & {
      query: ObservableQuery<TubeStationsQuery, TubeStationsQueryVariables>;
    }
  >({ data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q }, (set) => {
    q.subscribe((v: any) => {
      set({ ...v, query: q });
    });
  });
  return result;
};
