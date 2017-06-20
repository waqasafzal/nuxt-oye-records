<template>
  <div class="checkout__param">
    <div class="header">
      <h4>
        <slot></slot>
      </h4>
      <div @click="onChange" class="change-link">Change</div>
    </div>
    <div class="content">
      <p v-for="line in lines">{{line}}</p>
    </div>
    <slot name="extra"></slot>
  </div>
</template>

<script>
  export default {
    name: 'CheckoutParameter',
    props: ['lines'],
    methods: {
      onChange () {
        this.$emit('change')
      }
    }
  }
</script>
