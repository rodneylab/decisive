import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function load({ request }) {
	try {
		const response = await graphqlQuery(meQuery, {}, request);
		const { data } = await response.json();
		return { ...data };
	} catch (error) {
		console.error(`Error in load function for /login: ${error}`);
	}
};
