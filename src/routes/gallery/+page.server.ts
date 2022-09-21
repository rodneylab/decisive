import galleriesQuery from '$lib/graphql/queries/galleries';
import meQuery from '$lib/graphql/queries/me';
import tubeStationsQuery from '$lib/graphql/queries/tubeStations';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/gallery/$types';

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
    const response = await graphqlQuery(galleriesQuery, {}, request);

    return {
      ...(await response.json()).data,
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
