<script lang="ts">
  import { browser } from '$app/env';
  import website from '$lib/config/website';
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  export let id: string;
  export let location: {
    latitude: number;
    longitude: number;
  };
  export let zoom: number = 19;
  export let style: string = 'width:425px; height:350px';
  export let marker: boolean = false;
  export let markerMarkup: string = '';

  const { mapboxAccessToken } = website;
  const { latitude, longitude } = location;

  async function setMap() {
    if (browser) {
      const { map: leafletMap, marker: leafletMarker, tileLayer } = await import('leaflet');
      const map = leafletMap(id).setView([latitude, longitude], zoom);
      tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}',
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 19,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: mapboxAccessToken,
          detectRetina: true
        }
      ).addTo(map);
      if (marker) {
        if (markerMarkup) {
          leafletMarker([latitude, longitude]).bindPopup(markerMarkup).addTo(map);
        } else {
          leafletMarker([latitude, longitude]).addTo(map);
        }
      }
    }
  }

  onMount(async () => {
    setMap();
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://api.mapbox.com" />
  <link rel="dns-prefetch" href="https://api.mapbox.com" />
</svelte:head>

<div {id} {style} />
