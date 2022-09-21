import meQuery from '$lib/graphql/queries/me';
import tubeStationsQuery from '$lib/graphql/queries/tubeStations';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function load({ url, request }) {
  try {
    const meResponse = await graphqlQuery(meQuery, {}, request);
    const { data } = await meResponse.json();
    if (!data?.me) {
      return {
        status: 301,
        redirect: '/login'
      };
    }

    const tubeStationResponse = await graphqlQuery(tubeStationsQuery, {}, request);
    const tubeStationsData = await tubeStationResponse.json();

    return {
      ...tubeStationsData.data,
      ...data
    };
  } catch (err: unknown) {
    const { pathname } = url;
    const message = `Error in load function for ${pathname}: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
