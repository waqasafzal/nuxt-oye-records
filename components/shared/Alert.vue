<template>
  <transition name="fade">
    <div 
      v-if="show" 
      :class="['alert-list__' + type]">
      <slot/>
      <div class="alert-list__buttons">
        <div 
          v-for="(button, i) in buttons" 
          :key="`alert-button-${i}`">
          <nuxt-link :to="button.route">
            <div class="alert-list__button">
              {{ button.title }}
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    type: {
      type: String,
      default: 'info'
    },
    timeout: {
      type: Number,
      default: 2000
    },
    buttons: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      show: true,
      disableAlertTimeout: undefined
    }
  },
  mounted: function() {
    var vm = this
    this.disableAlertTimeout = setTimeout(function() {
      vm.show = false
    }, this.timeout)
  },
  beforeDestroy() {
    clearTimeout(this.disableAlertTimeout)
  }
}
</script>

<style>
.fade-leave-active,
.fade-enter-active {
  transition: opacity 1s ease;
  -webkit-transition: opacity 1s ease;
}
.fade-leave-to,
.fade-enter {
  opacity: 0;
}
</style>
