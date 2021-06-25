<template>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="https://rsk.co">
        <img
          id="logo"
          src="https://developers.rsk.co/assets/img/rsk_logo.svg"
          class="logo"
          alt="RSK Token Bridge"
        />
      </a>
      <div
        class="wallet-status navbar-item indicator badge-outline badge-pill"
        style="display: none;"
      >
        <span aria-describedby="tooltip-status" class="fromNetwork">Network</span>
      </div>
      <button
        class="navbar-toggler collapsed"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarResponsive" class="navbar-collapse collapse">
        <div
          class="wallet-status navbar-item badge-pill text-truncate"
          style="width: 85px; display: none;"
        >
          <span id="address">0x123456789</span>
        </div>
        <div class="navbar-item ml-auto">
          <button id="logIn" type="button" class="btn btn-primary badge-pill">
            Connect wallet
          </button>
          <a id="help" href="https://developers.rsk.co/slack/" style="display: none;">
            Do you need help?
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  components: {},
}
</script>
