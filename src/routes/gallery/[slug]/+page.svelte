<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, prefetch } from '$app/navigation';
	import CreateExhibition from '$lib/components/CreateExhibition.svelte';
	import EditableText from '$lib/components/EditableText.svelte';
	import EditOpeningHours from '$lib/components/EditOpeningHours.svelte';
	import LessIcon from '$lib/components/Icons/Less.svelte';
	import Map from '$lib/components/Map.svelte';
	import { N_DASH_ENTITY, THIN_SPACE_ENTITY } from '$lib/constants/entities';
	import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
	import type {
		Gallery,
		GalleryQueryResponse,
		Mutation,
		UpdateGalleryInput,
		User
	} from '$lib/generated/graphql';
	import galleries from '$lib/shared/stores/galleries';
	import user from '$lib/shared/stores/user';
	import type { GalleryFormErrors } from '$lib/utilities/form';
	import { mapErrorsToFields } from '$lib/utilities/form';
	import dayjs from 'dayjs';
	import { afterUpdate, onMount } from 'svelte';

	export let data: { gallery: GalleryQueryResponse; me: User | null; slug: string };

	const { me, slug } = data;

	async function checkForLoggedInUser() {
		if (!$user && browser) {
			if (me) {
				user.set({ ...me });
			} else {
				await prefetch('/login');
				await goto('/login');
			}
		}
	}

	onMount(() => {
		checkForLoggedInUser();
	});

	afterUpdate(() => {
		checkForLoggedInUser();
	});

	const index = $galleries.findIndex((element) => element?.slug === slug);
	if (index >= 0) {
		galleries.set([
			...$galleries.slice(0, index),
			data.gallery.gallery,
			...$galleries.slice(index + 1)
		]);
	} else {
		galleries.set([...$galleries, data.gallery.gallery]);
	}

	let gallery: Gallery;
	$: gallery = $galleries.find((element) => element.slug === slug);
	$: id = gallery.id;
	$: postalAddress = { ...gallery.postalAddress };
	$: name = gallery.name;
	$: openingHoursRanges = gallery.openingHours.openingHoursRanges ?? [];
	$: byAppointmentOpeningHoursRanges = gallery.byAppointmentOpeningHours.openingHoursRanges ?? [];
	$: openingTimes = gallery.openingTimes;
	$: byAppointmentOpeningTimes = gallery.byAppointmentOpeningTimes;
	$: website = gallery.website;
	$: websiteUrl = gallery.websiteUrl;
	$: location = gallery.location;
	$: openStreetMap = gallery.openStreetMap;
	$: updating = false;
	$: streetAddress = gallery.postalAddress.streetAddress;
	$: locality = gallery.postalAddress.locality;
	$: city = gallery.postalAddress.city;
	$: postalCode = gallery.postalAddress.postalCode;
	$: country = gallery.postalAddress.country;
	$: nearestTubes = gallery.nearestTubes.map((element) => element.name);
	$: exhibitions = gallery.exhibitions;

	let newNearestTube: string = '';

	let errors: GalleryFormErrors;
	$: errors = {};

	async function handleUpdate(changes: UpdateGalleryInput) {
		try {
			updating = true;
			const response = await fetch('/query/update/gallery.json', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					input: {
						...changes
					}
				})
			});
			const responseData = await response.json();
			const { errors: formErrors, gallery }: Mutation['updateGallery'] =
				responseData.data.updateGallery;
			updating = false;
			if (formErrors) {
				errors = mapErrorsToFields(formErrors);
			} else {
				galleries.set([...$galleries, gallery]);
				if (changes.name) {
					name = changes.name;
				}
				if (changes.slug) {
					await prefetch(`/gallery/${changes.slug}`);
					await goto(`/gallery/${changes.slug}`);
				}
				if (changes.postalAddress) {
					streetAddress = changes.postalAddress.streetAddress;
					locality = changes.postalAddress.locality;
					city = changes.postalAddress.city;
					postalCode = changes.postalAddress.postalCode;
					country = changes.postalAddress.country;
				}
				if (changes.replacementOpeningHours) {
					openingTimes = gallery.openingTimes;
					openingHoursRanges = gallery.openingHours.openingHoursRanges;
				}
				if (changes.addNearestTubes) {
					nearestTubes = [...nearestTubes, ...changes.addNearestTubes];
				}
			}
		} catch (error) {
			console.error(`Error in handleSubmit function in UpdateGallery: ${error}`);
		}
	}

	const dateFormat = 'dddd, DD-MMM-YYYY';
</script>

<nav aria-label="All galleries">
	<a aria-label="See all galleries" href="/gallery" data-sveltekit-prefetch>See all galleries</a>
</nav>
{#if updating}
	<div>Updating...</div>
{/if}
<h1>{name}</h1>
<dl>
	<dt>Gallery Name</dt>
	<dd>
		<EditableText
			buttonLabel="Edit gallery name"
			value={name}
			id={`${slug}-edit-name`}
			placeholder={PLACEHOLDER_TEXT.galleryName}
			title={TITLE.galleryName}
			error={errors.name}
			on:update={(event) => {
				handleUpdate({ id, name: event.detail });
			}}
		/>
	</dd>
	<dt>slug</dt>
	<dd>
		<EditableText
			buttonLabel="Edit gallery slug"
			value={slug}
			id={'edit-slug'}
			placeholder={PLACEHOLDER_TEXT.slug}
			title={TITLE.slug}
			error={errors.slug}
			on:update={(event) => {
				handleUpdate({ id, slug: event.detail });
			}}
		/>
	</dd>
	<dt>Address</dt>
	<dd>
		<EditableText
			buttonLabel="Edit gallery street address"
			value={streetAddress}
			id={`${slug}-edit-address`}
			placeholder={PLACEHOLDER_TEXT.streetAddress}
			title={TITLE.streetAddress}
			error={errors.streetAddress}
			on:update={(event) => {
				handleUpdate({ id, postalAddress: { ...postalAddress, streetAddress: event.detail } });
			}}
		/>
	</dd>
	<dd>
		<EditableText
			buttonLabel="Edit gallery address locality"
			value={locality}
			id={`${slug}-edit-locality`}
			placeholder={PLACEHOLDER_TEXT.locality}
			title={TITLE.locality}
			error={errors.locality}
			on:update={(event) => {
				handleUpdate({ id, postalAddress: { ...postalAddress, locality: event.detail } });
			}}
		/>
	</dd>
	<dd>
		<EditableText
			buttonLabel="Edit gallery address city"
			value={city}
			id={`${slug}-edit-city`}
			placeholder={PLACEHOLDER_TEXT.city}
			title={TITLE.city}
			error={errors.city}
			on:update={(event) => {
				handleUpdate({ id, postalAddress: { ...postalAddress, city: event.detail } });
			}}
		/>
	</dd>
	<dd>
		<EditableText
			buttonLabel="Edit gallery address postal code"
			value={postalCode}
			id={`${slug}-edit-postal-code`}
			placeholder={PLACEHOLDER_TEXT.postalCode}
			title={TITLE.postalCode}
			error={errors.postalCode}
			on:update={(event) => {
				handleUpdate({ id, postalAddress: { ...postalAddress, postalCode: event.detail } });
			}}
		/>
	</dd>
	<dd>
		<EditableText
			buttonLabel="Edit gallery address country"
			value={country}
			id={`${slug}-edit-country`}
			placeholder={PLACEHOLDER_TEXT.country}
			title={TITLE.country}
			error={errors.country}
			on:update={(event) => {
				handleUpdate({ id, postalAddress: { ...postalAddress, country: event.detail } });
			}}
		/>
	</dd>
	<EditOpeningHours {id} {openingTimes} {openingHoursRanges} />
	<EditOpeningHours
		{id}
		openingTimes={byAppointmentOpeningTimes}
		openingHoursRanges={byAppointmentOpeningHoursRanges}
		text="By appointment opening times"
		type="by-appointment"
	/>
	<dt>website</dt>
	<dd>
		<EditableText
			ariaLabel={`Open the ${name} website`}
			href={websiteUrl}
			buttonLabel="Edit gallery website URL"
			value={website}
			id={`${slug}-edit-website`}
			placeholder={PLACEHOLDER_TEXT.website}
			title={TITLE.website}
			error={errors.website}
			on:update={(event) => {
				handleUpdate({ id, website: event.detail });
			}}
		/>
	</dd>
	<dt>Nearest Tube Stations</dt>
	{#each nearestTubes as tubeStationName}
		{tubeStationName}
		<button
			aria-label="Remove this station"
			on:click|preventDefault={() => {
				handleUpdate({ id, removeNearestTubes: [tubeStationName] });
			}}><LessIcon /></button
		>
	{:else}
		No nearest tubes added yet
	{/each}
	<EditableText
		buttonLabel="Add an existing station to gallery nearest tubes"
		value={newNearestTube}
		id={`${slug}-new-nearest-tube`}
		placeholder={PLACEHOLDER_TEXT.tubeStationName}
		title={TITLE.tubeStationName}
		error={errors.tubeStation}
		on:update={(event) => {
			handleUpdate({ id, addNearestTubes: [event.detail] });
		}}
	/>
	<EditableText
		href={websiteUrl}
		buttonLabel="Edit gallery website URL"
		value={website}
		id={`${slug}-edit-website`}
		placeholder={PLACEHOLDER_TEXT.website}
		title={TITLE.website}
		error={errors.website}
		on:update={(event) => {
			handleUpdate({ id, website: event.detail });
		}}
	/>
	<dt>Map</dt>
	<dd>
		<EditableText
			buttonLabel="Edit gallery map"
			value={openStreetMap ? openStreetMap : ''}
			id={`${slug}-edit-map`}
			placeholder={PLACEHOLDER_TEXT.openStreetMap}
			title={TITLE.openStreetMap}
			error={errors.openStreetMap}
			on:update={(event) => {
				handleUpdate({ id, openStreetMapUrl: event.detail });
			}}
		/>
	</dd>
</dl>
<h2>Exhibitions</h2>
<ul>
	{#each exhibitions as { name, id, start, end }}
		<li>
			<h3>
				<a
					aria-label={`Open the ${name} exhibition page`}
					data-sveltekit-prefetch
					href={`/exhibition/${id}`}>{name}</a
				>
			</h3>
			<dl>
				<dt>Runs</dt>
				<dd>
					{dayjs(start).format(
						dateFormat
					)}{THIN_SPACE_ENTITY}{N_DASH_ENTITY}{THIN_SPACE_ENTITY}{dayjs(end).format(dateFormat)}
				</dd>
			</dl>
		</li>
	{/each}
</ul>
<h3>Add a New Exhibition</h3>
<CreateExhibition gallerySlug={slug} />

{#if location}
	<Map
		{location}
		id={`${slug}-map`}
		style="width:100%;height:25rem"
		marker
		markerMarkup={`<strong>${name}</strong><br/>${locality}`}
	/>
{/if}
