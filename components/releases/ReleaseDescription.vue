<template>
  <div class="product__info__description">
    <div 
      id="description" 
      :class="[ expanded ? '' : 'product__info__description__stripped']">
      <vue-markdown>{{ release.description }}</vue-markdown>
    </div>
    <div 
      v-if="lines > 7" 
      class="product__info__description more" 
      @click.prevent="toggleExpansion">
      <!--{{lines}}-->
      <template v-if="!expanded">Read more</template>
      <template v-else>Read less</template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'

Vue.component('vue-markdown', VueMarkdown)

export default {
  name: 'ReleaseDescription',
  components: [VueMarkdown],
  props: {
    release: {
      type: Object,
      default: undefined
    }
  },
  data: function() {
    return {
      expanded: true,
      lines: 0
    }
  },
  mounted() {
    let descriptions = document.getElementById('description')
    if (descriptions) {
      let divHeight = descriptions.offsetHeight
      let lineHeight = descriptions.style.lineHeight
      if (!lineHeight) {
        lineHeight = document.defaultView.getComputedStyle(descriptions, null)
          .lineHeight
      }
      if (!lineHeight) {
        lineHeight = 24
      }
      let lineHeightInt = parseInt(lineHeight)
      let lines = divHeight / lineHeightInt
      this.lines = lines
      if (this.lines > 7) {
        this.expanded = false
      }
    } else {
      this.lines = 0
    }
  },
  methods: {
    toggleExpansion: function() {
      this.expanded = !this.expanded
      return this.expanded
    }
  }
}
</script>
