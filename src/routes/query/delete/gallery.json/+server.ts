import deleteGalleryMutation from '$lib/graphql/mutations/deleteGallery';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function post({ cookies, request }) {
	try {
		const { id: deleteGalleryId } = await request.json();

		const response = await graphqlQuery(
			deleteGalleryMutation,
			{
				deleteGalleryId
			},
			request
		);

		const data = await response.json();

		return new Response(JSON.stringify({ data }));
	} catch (err: unknown) {
		const message = `Error in /query/delete/gallery.json.ts: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
