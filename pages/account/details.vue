<template>
  <div class="row">
    <div class="col-12">
      <div class="page__header">Account</div>
      {{ user.name }}
      <div v-if="user.canPublishCharts">
        <p>Create charts</p>
        <p>Edit charts</p>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'AccountDetails',
    middleware: 'authenticated',
    computed: {
      user () {
        return this.$store.state.user
      }
    }
  }
</script>
