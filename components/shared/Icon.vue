<template>
  <svg 
    :class="className" 
    :width="width" 
    :height="height">
    <use :xlink:href="glyph" />
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    className: {
      type: String,
      default: null
    },
    glyph: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    }
  }
}
</script>
