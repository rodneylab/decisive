<script context="module">
  export const load = async ({ fetch }) => {
    try {
      const response = await fetch('/query/hello.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'you'
        })
      });
      return {
        props: { ...(await response.json()) }
      };
    } catch (error) {
      console.error(`Error in load function for /hello: ${error}`);
    }
  };
</script>

<script lang="ts">
  export let data;

  const { hello }: { hello: string } = data;
</script>

<h1>Welcome</h1>
<p>{hello}</p>
<pre>{JSON.stringify(data, null, 2)}</pre>
