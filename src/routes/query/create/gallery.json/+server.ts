import type { CreateGalleryInput } from '$lib/generated/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import createGalleryMutation from '$lib/graphql/mutations/createGallery';
import { graphqlQuery } from '$lib/utilities/graphql';

export const POST: RequestHandler = async function post({ cookies, request }) {
	try {
		const { input: createGalleryInput }: { input: CreateGalleryInput } = await request.json();
		const response = await graphqlQuery(
			createGalleryMutation,
			{
				createGalleryInput
			},
			request
		);

		const data = await response.json();

		return new Response(JSON.stringify({ ...data }));
	} catch (err: unknown) {
		const message = `Error in /query/create/gallery.json.ts: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
