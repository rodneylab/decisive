<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit';
  export const load = async ({ fetch, params, url }: LoadInput) => {
    try {
      // check for valid user session
      const meResponse = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include'
      });
      const { data } = await meResponse.json();
      if (!data?.me) {
        return {
          status: 301,
          redirect: '/login'
        };
      }
      const { id } = params;
      const response = await fetch(`/query/exhibition/${id}.json`, {
        method: 'POST',
        credentials: 'include'
      });
      return {
        props: { ...(await response.json()), ...data, id }
      };
    } catch (error) {
      const { pathname } = url;
      console.error(`Error in load function for ${pathname}: ${error}`);
    }
  };
</script>

<script lang="ts">
  import type { ExhibitionQueryResponse } from '$lib/generated/graphql';

  export let data: { exhibition: ExhibitionQueryResponse };
</script>

<h1>{data.exhibition.exhibition.name}</h1>
