import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';
import type { LayoutServerLoad } from '../../.svelte-kit/types/src/routes/$types';

export const load: LayoutServerLoad = async function load({ cookies, request, url }) {
  try {
    const { pathname } = url;
    const response = await graphqlQuery(meQuery, {}, request);
    const data = await response.json();

    return {
      ...data,
      pathname
    };
  } catch (error) {
    const { pathname } = url;
    console.error(`Error in layout load function for ${pathname}: ${error}`);
  }
};
