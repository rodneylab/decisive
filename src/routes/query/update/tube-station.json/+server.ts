import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

import updateTubeStationMutation from '$lib/graphql/mutations/updateTubeStationMutation';
import { graphqlQuery } from '$lib/utilities/graphql';

export const POST: RequestHandler = async function post({ cookies, request }) {
	try {
		const { input: updateTubeStationInput } = await request.json();
		const response = await graphqlQuery(
			updateTubeStationMutation,
			{
				updateTubeStationInput
			},
			request
		);

		const data = await response.json();

		return new Response(JSON.stringify({ ...data }));
	} catch (err: unknown) {
		const message = `Error in /query/update/tube-station.json.ts: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
