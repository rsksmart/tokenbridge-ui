<template>
  <div>
    <h3 class="text-primary">
      Destination <strong>{{ destinationNetwork.name }}</strong>
    </h3>
    <div class="card mb-3 p-3">
      <div class="row no-gutters">
        <div class="col-md-3 p-1 text-center">
          <img v-if="!metadata.image" :src="metadata.image" alt="information" />
          <div
            v-else
            class="w-100 h-50 bg-light rounded-sm d-flex align-items-center justify-content-center"
          >
            <span class="fa fa-image display-2 text-muted"></span>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card-body px-5">
            <h5 class="card-title">{{ metadata.name }}</h5>
            <p
              id="description"
              class="card-text"
              :class="{ 'read-more': !readMore && showReadModeButton }"
              style="white-space: pre-line"
            >
              {{ metadata.description }}
            </p>
            <button
              v-if="showReadModeButton"
              class="btn btn-sm btn-link text-left p-0"
              @click="handleReadMore"
            >
              <span v-if="!readMore">...Read More</span>
              <span v-else>...Read Less</span>
            </button>
          </div>
          <div class="card-footer bg-transparent px-5 text-right">
            <a v-if="metadata.link" class="btn btn-link" :href="metadata.link" target="_blank">
              <span class="fa fa-file-code"></span> Metadata
            </a>
            <a
              v-if="metadata.external_link"
              class="btn btn-link"
              :href="metadata.external_link"
              target="_blank"
            >
              <span class="fa fa-link"></span> External Link
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFTViewInformation',
  props: {
    destinationNetwork: {
      type: Object,
      required: true,
    },
    metadata: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { readMore: false }
  },
  computed: {
    showReadModeButton() {
      return this.metadata.description.length > 200
    },
  },
  methods: {
    handleReadMore() {
      this.readMore = !this.readMore
    },
  },
}
</script>

<style scoped>
.read-more {
  height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
