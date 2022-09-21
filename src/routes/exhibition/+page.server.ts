import exhibitionsQuery from '$lib/graphql/queries/exhibitions';
import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function load({ request, url }) {
  try {
    const meResponse = await graphqlQuery(meQuery, {}, request);
    const { data: meData } = await meResponse.json();
    if (!meData?.me) {
      return {
        status: 301,
        redirect: '/login'
      };
    }

    const exhitibionsResponse = await graphqlQuery(exhibitionsQuery, {}, request);
    const { data: exhibibitionsData } = await exhitibionsResponse.json();
    const { pathname } = url;

    return {
      ...meData,
      ...exhibibitionsData,
      slug: pathname
    };
  } catch (err: unknown) {
    const { pathname } = url;
    const message = `Error in load function for ${pathname}: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
