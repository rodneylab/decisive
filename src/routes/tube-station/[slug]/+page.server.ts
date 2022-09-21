import meQuery from '$lib/graphql/queries/me';
import tubeStationQuery from '$lib/graphql/queries/tubeStation';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function load({ params, request, url }) {
	try {
		// check for valid user session
		const meResponse = await graphqlQuery(meQuery, {}, request);
		const { data: meData } = await meResponse.json();

		if (!meData?.me) {
			return {
				status: 301,
				redirect: '/login'
			};
		}

		const { slug } = params;

		const response = await graphqlQuery(
			tubeStationQuery,
			{
				tubeStationSlug: slug
			},
			request
		);

		const { data: tubeStationData } = await response.json();

		return {
			...tubeStationData,
			...meData,
			slug
		};
	} catch (err: unknown) {
		const { pathname } = url;
		const message = `Error in load function for ${pathname}: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
