// import type { RequestHandler } from './__types/[slug].json';

// export const POST: RequestHandler = async function post({ params, request }) {
//   try {
//     const { slug } = params;
//     const query = `
//       query GalleryQuery($galleryQuerySlug: String!) {
//         gallery(slug: $galleryQuerySlug) {
//           gallery {
//             id
//             name
//             slug
//             address
//             postalAddress {
//               streetAddress
//               locality
//               city
//               postalCode
//               country
//             }
//             openingTimes
//             openingHours {
//               openingHoursRanges {
//                 id
//                 startDay
//                 endDay
//                 openingTime
//                 closingTime
//               }
//             }
//             byAppointmentOpeningTimes
//             byAppointmentOpeningHours {
//               openingHoursRanges {
//                 id
//                 startDay
//                 endDay
//                 openingTime
//                 closingTime
//               }
//             }
//             exhibitions {
//               name
//               id
//               start
//               end
//             }
//             website
//             websiteUrl
//             nearestTubes {
//               name
//             }
//             openStreetMap
//             location {
//               latitude
//               longitude
//             }
//           }
//         }
//       }
//     `;

//     const variables = {
//       galleryQuerySlug: slug
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
