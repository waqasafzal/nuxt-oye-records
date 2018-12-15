<template>
  <div class="alert-list">
    <alert 
      v-for="(alert, i) in alerts" 
      :key="i" 
      :type="alert.level" 
      :timeout="alert.timeout" 
      :buttons="alert.buttons" 
      class="alert-list__item">
      <span v-html="alert.message"/>
    </alert>
  </div>
</template>

<script>
import Alert from '../../components/shared/Alert.vue'

export default {
  name: 'Alerts',
  components: { Alert },
  data: function() {
    return {
      show: false
    }
  },
  computed: {
    alerts: function() {
      if (!this.$store.state.alerts) {
        return []
      }
      return this.$store.state.alerts
    }
  }
}
</script>
