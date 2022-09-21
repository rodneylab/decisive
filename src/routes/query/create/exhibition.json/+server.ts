import type { CreateExhibitionInput, CreateExhibitionResponse } from '$lib/generated/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import createExhibitionMutation from '$lib/graphql/mutations/createExhibition';
import { graphqlQuery } from '$lib/utilities/graphql';

export const POST: RequestHandler = async function post({ cookies, request }) {
	try {
		const { input: createExhitibionInput }: { input: CreateExhibitionInput } = await request.json();
		const response = await graphqlQuery(
			createExhibitionMutation,
			{
				createExhitibionInput
			},
			request
		);
		const { headers } = response;
		const data = (await response.json()) as CreateExhibitionResponse;

		return new Response(JSON.stringify({ ...data }));
	} catch (err: unknown) {
		const message = `Error in /query/create/exhibition.json.ts: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
