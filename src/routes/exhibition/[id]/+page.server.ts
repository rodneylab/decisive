import exhibitionQuery from '$lib/graphql/queries/exhibition';
import meQuery from '$lib/graphql/queries/me';
import photographersQuery from '$lib/graphql/queries/photographers';
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

		const { id } = params;

		const exhibitionPromise = graphqlQuery(
			exhibitionQuery,
			{
				exhibitionId: id
			},
			request
		);
		const photographersPromise = graphqlQuery(photographersQuery, {}, request);
		const [exhibitionResponse, photographersResponse] = await Promise.all([
			exhibitionPromise,
			photographersPromise
		]);
		const { data: exhibitionData } = await exhibitionResponse.json();
		const { data: photographersData } = await photographersResponse.json();

		return {
			...exhibitionData,
			...photographersData,
			...meData,
			id
		};
	} catch (err: unknown) {
		const { pathname } = url;
		const message = `Error in load function for ${pathname}: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
