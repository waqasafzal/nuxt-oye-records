<template>
  <div 
    v-if="loading" 
    class="row loader">
    <div class="col-12">
      <img 
        alt="Loading spinner" 
        src="../../assets/images/load_more.svg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
