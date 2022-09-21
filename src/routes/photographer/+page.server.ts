import type { PageServerLoad } from './$types';
import photographersQuery from '$lib/graphql/queries/photographers';
import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';

export const load: PageServerLoad = async function load({ params, request, url }) {
  try {
    const { pathname } = url;
    const meResponse = await graphqlQuery(meQuery, {}, request);
    const { data: meData } = await meResponse.json();
    if (!meData?.me) {
      return {
        status: 301,
        redirect: '/login'
      };
    }

    const photographersResponse = await graphqlQuery(photographersQuery, {}, request);
    const { data: photographersData } = await photographersResponse.json();
    console.log({ photographersData });
    return {
      ...meData,
      ...photographersData,
      slug: pathname
    };
  } catch (error) {
    const { pathname } = url;
    console.error(`Error in load function for ${pathname}: ${error}`);
  }
};
