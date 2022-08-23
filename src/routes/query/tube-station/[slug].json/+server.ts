// import type { RequestHandler } from './__types/[slug].json';

// export const POST: RequestHandler = async function post({ params, request }) {
//   try {
//     const { slug } = params;
//     const query = `
// 			query Query($tubeStationSlug: String!) {
// 				tubeStation(slug: $tubeStationSlug) {
// 					tubeStation {
// 						name
// 						slug
// 						id
// 					}
// 					error
// 				}
// 			}
//     `;

//     const variables = {
//       tubeStationSlug: slug
//     };

//     const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Cookie: request.headers.get('Cookie')
//       },
//       body: JSON.stringify({
//         query,
//         variables
//       })
//     });

//     const { headers } = response;
//     const data = await response.json();

//     return {
//       body: JSON.stringify({ ...data }),
//       headers: {
//         'Set-Cookie': headers.get('Set-Cookie')
//       }
//     };
//   } catch (err) {
//     const error = `Error in /query/gallery/[slug].json.ts: ${err}`;
//     console.error(error);
//     return {
//       status: 500,
//       error
//     };
//   }
// };
