<template>
  <footer class="footer-rsk mb-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col ml-0">
          <div class="row footer-logo mx-0">
            <span>Built by</span>
            <div class="col pl-0">
              <v-img
                position="center left"
                src="@/assets/logo-iov.svg"
                alt="IOV Labs"
                width="100"
                contain
                class="rsk-main-logo"
              />
            </div>
          </div>
          <p>Copyright © 2021 IOV Labs All rights reserved</p>
        </div>
        <div class="col-7">
          <div class="row justify-content-center mx-0 footer-links h-100">
            <a href="https://www.iovlabs.org/" target="_blank"> About IOV Labs </a>
            <a href="https://open-rsk-dev.slack.com/messages/support">Help</a>
            <a href="https://www.rsk.co/terms-conditions" target="_blank">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
        <div class="col">
          <div class="row justify-content-end align-items-baseline mx-0 footer-icons">
            <a href="https://twitter.com/rsksmart" target="_blank">
              <v-icon>mdi-twitter</v-icon>
            </a>
            <a href="https://github.com/rsksmart/tokenbridge-ui" target="_blank">
              <v-icon>mdi-github</v-icon>
            </a>
            <a href="https://open-rsk-dev.slack.com/messages/support" target="_blank">
              <v-icon>mdi-slack</v-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  components: {},
  props: {
    socialNetworkButtons: {
      type: Array,
      default: function () {
        return [
          { icon: 'mdi-slack', link: 'http://developers.rsk.co/slack' },
          { icon: 'mdi-twitter', link: 'https://twitter.com/rsksmart' },
          { icon: 'mdi-youtube', link: 'https://www.youtube.com/rsksmart' },
          { icon: 'mdi-facebook', link: 'https://www.facebook.com/RSKsmart/' },
          { icon: 'fab fa-gitter', link: 'https://gitter.im/rsksmart' },
          { icon: 'mdi-reddit', link: 'https://www.reddit.com/r/rootstock/' },
          { icon: 'fab fa-telegram', link: 'https://t.me/rskofficialcommunity' },
          { icon: 'fab fa-medium', link: 'https://medium.com/@RSKNews' },
          { icon: 'fab fa-telegram', link: 'https://t.me/rsksmartcontract' },
          { icon: 'fab fa-btc', link: 'https://bitcointalk.org/index.php?topic=5124334' },
          { icon: 'mdi-instagram', link: 'https://www.instagram.com/rsksmart/' },
        ]
      },
    },
  },
}
</script>
