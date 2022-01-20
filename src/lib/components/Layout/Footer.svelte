<script>
  import RodneyLabCredit from '$lib/components/Layout/RodneyLabCredit.svelte';
  import { COPYRIGHT_ENTITY } from '$lib/constants/entities';
</script>

<footer class="footer-container">
  <div>
    Created by <a
      aria-label="Open the Rodney Lab site"
      href="https://rodneylab.com/"
      target="_blank"
      rel="noopener noreferrer">Rodney Lab</a
    >. Copyright {COPYRIGHT_ENTITY} 2021–2022.
  </div>
  <RodneyLabCredit />
</footer>

<style>
  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 768px;
    margin: 48px auto 0;
    width: 100%;
  }
</style>
