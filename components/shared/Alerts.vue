<template>
  <div class="alert-list">
    <alert :key="i" :type="alert.level" :timeout="alert.timeout" :buttons="alert.buttons" class="alert-list__item" v-for="(alert, i) in alerts">
      <span v-html="alert.message"></span>
    </alert>
  </div>
</template>

<script>
  import Alert from '../../components/shared/Alert.vue'

  export default {
    name: 'Alerts',
    components: {Alert},
    data: function () {
      return {
        show: false
      }
    },
    computed: {
      alerts: function () {
        if (!this.$store.state.alerts) {
          return []
        }
        return this.$store.state.alerts
      }
    }
  }
</script>
