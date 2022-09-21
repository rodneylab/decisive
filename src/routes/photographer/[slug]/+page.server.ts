import type { PageServerLoad } from './$types';
import photographerQuery from '$lib/graphql/queries/photographer';
import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';

export const load: PageServerLoad = async function load({ params, request, url }) {
	try {
		const meResponse = await graphqlQuery(meQuery, {}, request);
		const { data: meData } = await meResponse.json();
		if (!meData?.me) {
			return {
				status: 301,
				redirect: '/login'
			};
		}

		const { slug } = params;
		const photographerResponse = await graphqlQuery(
			photographerQuery,
			{ photographerQuerySlug: slug },
			request
		);
		const { data: photographerData } = await photographerResponse.json();

		return {
			...photographerData,
			...meData,
			slug
		};
	} catch (error) {
		const { pathname } = url;
		console.error(`Error in load function for ${pathname}: ${error}`);
	}
};
