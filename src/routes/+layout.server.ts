import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';
import type { LayoutServerLoad } from '../../.svelte-kit/types/src/routes/$types';

export const load: LayoutServerLoad = async function load({ request, url, setHeaders }) {
  try {
    const { pathname } = url;
    const response = await graphqlQuery(meQuery, {}, request);
    const { headers } = response;
    const data = await response.json();

    if (!request.headers.has('Set-Cookie')) {
      setHeaders({
        'Set-Cookie': headers.get('Set-Cookie')
      });
    }

    return {
      ...data,
      pathname
    };
  } catch (error) {
    const { pathname } = url;
    console.error(`Error in layout load function for ${pathname}: ${error}`);
  }
};
