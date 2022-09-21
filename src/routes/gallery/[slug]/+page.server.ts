import galleryQuery from '$lib/graphql/queries/gallery';
import meQuery from '$lib/graphql/queries/me';
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
			galleryQuery,
			{
				galleryQuerySlug: slug
			},
			request
		);

		const { data: galleryData } = await response.json();

		return {
			...galleryData,
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
