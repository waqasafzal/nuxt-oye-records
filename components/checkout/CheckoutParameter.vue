<template>
  <div class="checkout__param">
    <div class="header">
      <h4>
        <slot/>
      </h4>
      <div 
        class="change-link" 
        @click="onChange">Change</div>
    </div>
    <div class="content">
      <p 
        v-for="(line, li) in lines" 
        :key="`line-${li}`">{{ line }}</p>
    </div>
    <slot name="extra"/>
  </div>
</template>

<script>
export default {
  name: 'CheckoutParameter',
  props: {
    lines: {
      type: Object,
      default: null
    }
  },
  methods: {
    onChange() {
      this.$emit('change')
    }
  }
}
</script>
