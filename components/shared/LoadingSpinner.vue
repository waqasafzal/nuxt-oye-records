<template>
  <div class="row loader" v-if="loading">
    <div class="col-12">
      <img src="../../assets/images/load_more.svg"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LoadingSpinner',
    props: ['loading']
  }
</script>
