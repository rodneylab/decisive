import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function load({ cookies, request, url }) {
  try {
    const response = await graphqlQuery(meQuery, {}, request);
    const { headers } = response;
    const { data } = await response.json();

    return { ...data };
  } catch (err: unknown) {
    const { pathname } = url;
    const message = `Error in load function for ${pathname}: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
