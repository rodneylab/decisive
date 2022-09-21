<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, prefetch } from '$app/navigation';
	import SEO from '$lib/components/SEO/index.svelte';
	import type { Exhibition, PaginatedExhibitions, User } from '$lib/generated/graphql';
	import dayjs from 'dayjs';
	import exhibitions from '$lib/shared/stores/exhibitions';
	import user from '$lib/shared/stores/user';
	import { onMount } from 'svelte';
	import {
		LowerCaseSanitizer,
		PrefixIndexStrategy,
		Search as JSSearch,
		StemmingTokenizer,
		StopWordsTokenizer,
		TfIdfSearchIndex
	} from 'js-search';
	import { stemmer } from 'stemmer';
	import { TextInputField } from '@rodneylab/sveltekit-components';
	import { N_DASH_ENTITY, THIN_SPACE_ENTITY } from '$lib/constants/entities';
	import type { Dayjs } from 'dayjs';

	export let data: { exhibitions: PaginatedExhibitions };
	export let me: User | null;
	export let slug: string;

	async function checkForLoggedInUser() {
		if (!user && browser) {
			if (me) {
				user.set({ ...me });
			} else {
				await prefetch('/login');
				await goto('/login');
			}
		}
	}

	$: searchQuery = '';
	$: search = null;
	let searchResults: Exhibition[];
	$: searchResults = search && searchQuery ? search.search(searchQuery) : $exhibitions;

	const today: Dayjs = dayjs(new Date());
	const aWeekAhead: Dayjs = today.add(1, 'week');

	exhibitions.set(data.exhibitions.exhibitions);

	$: rebulidIndex;
	function rebulidIndex() {
		const dataToSearch = new JSSearch('id');

		dataToSearch.tokenizer = new StopWordsTokenizer(dataToSearch.tokenizer);
		dataToSearch.tokenizer = new StemmingTokenizer(stemmer, dataToSearch.tokenizer);
		dataToSearch.indexStrategy = new PrefixIndexStrategy();
		dataToSearch.sanitizer = new LowerCaseSanitizer();
		dataToSearch.searchIndex = new TfIdfSearchIndex('id');
		const indexBy = ['name', ['gallery', 'name']];

		indexBy.forEach((element) => {
			dataToSearch.addIndex(element);
		});
		dataToSearch.addDocuments([...$exhibitions]);
		search = dataToSearch;
	}

	function closingSoon(endDate: Dayjs): boolean {
		return today < endDate && endDate < aWeekAhead;
	}

	function openingSoon(startDate: Dayjs): boolean {
		const aWeekAhead: Dayjs = today.add(1, 'week');
		return today < startDate && startDate < aWeekAhead;
	}

	let exhibitionFilter: 'all' | 'closingSoon' | 'onNow' | 'openingSoon' = 'onNow';
	$: filteredResults =
		exhibitionFilter === 'all'
			? [...searchResults]
			: [...searchResults].filter((element) => {
					const { start, end } = element;
					const startDate = dayjs(start);
					if (exhibitionFilter === 'openingSoon') {
						return openingSoon(startDate);
					}
					const endDate = dayjs(end);
					if (exhibitionFilter === 'closingSoon') {
						return closingSoon(endDate);
					}
					// only on Now
					return startDate <= today && endDate >= today;
			  });

	onMount(() => {
		checkForLoggedInUser();
		rebulidIndex();
	});

	const dateFormat = 'dddd, DD-MMM-YYYY';
</script>

<SEO title="Exhibitions" {slug} metadescription="Exhibitions" />
<h1 id="exhibitions">Exhibitions</h1>
<label for="filter-exhibitions-all">All</label>
<input
	id="filter-exhibitions-all"
	type="radio"
	name="exhibition-filters"
	bind:group={exhibitionFilter}
	value="all"
/>

<label for="filter-exhibitions-on-now">On now?</label>
<input
	id="filter-exhibitions-on-now"
	type="radio"
	name="exhibition-filters"
	bind:group={exhibitionFilter}
	value="onNow"
/>
<label for="filter-exhibitions-opening-soon">Opening soon?</label>
<input
	id="filter-exhibitions-opening-soon"
	type="radio"
	name="exhibition-filters"
	bind:group={exhibitionFilter}
	value="openingSoon"
/>
<label for="filter-exhibitions-closing-soon">Closing soon?</label>
<input
	id="filter-exhibitions-closing-soon"
	type="radio"
	name="exhibition-filters"
	bind:group={exhibitionFilter}
	value="closingSoon"
/>
<form on:submit|preventDefault={() => {}}>
	<TextInputField
		bind:value={searchQuery}
		id="exhibition-search"
		placeholder="Find an exhibition"
		title="Find an exhibition"
		style="width:100%"
	/>
</form>
Showing {filteredResults.length} exhibitions.
<ul>
	{#each filteredResults as { id, name, start: startString, end: endString, freeEntry, online, inPerson, gallery, hashtags, photographers }}
		{@const galleryPage = `/gallery/${gallery.slug}`}
		{@const galleryName = gallery.name}
		{@const start = dayjs(startString)}
		{@const end = dayjs(endString)}
		<li>
			<h2>
				<a aria-label={`Open ${name} page`} data-sveltekit-prefetch href={`/exhibition/${id}`}
					>{name}</a
				>
			</h2>
			{#if openingSoon(start)}
				<strong>Opening soon!</strong>
			{:else if closingSoon(end)}
				<strong>Closing soon!</strong>
			{/if}
			{#if photographers.length}
				<p>
					Photographers:{' '}
					{#each photographers as { name: photographerName, slug: photographerSlug }}
						<a href={`/photographer/${photographerSlug}`}>{photographerName}</a>
					{/each}
				</p>{/if}
			<dl>
				<dt>Runs</dt>
				<dd>
					{start.format(
						dateFormat
					)}{THIN_SPACE_ENTITY}{N_DASH_ENTITY}{THIN_SPACE_ENTITY}{end.format(dateFormat)}
				</dd>
				<dt>Gallery</dt>
				<dd>
					<a aria-label={`Open the ${galleryName} page`} href={galleryPage}>{galleryName}</a>
				</dd>
				<dt>Attendance</dt>
				<dd>
					{[...(online ? ['Online'] : []), ...(inPerson ? ['In person'] : [])].join(', ')}
				</dd>
				{#if hashtags.length}
					<dt>Hashtags</dt>
					<dd>
						{hashtags.join(', ')}
					</dd>{/if}
			</dl>
			{#if freeEntry}Free entry{/if}
		</li>
	{/each}
</ul>
