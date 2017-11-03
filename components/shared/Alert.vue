<template>
  <transition name="fade">
    <div :class="['alert-list__' + type]" v-if="show">
      <slot></slot>
      <div class="alert-list__buttons">
        <div v-for="button in buttons">
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
        default: 'info'
      },
      buttons: {
        default: function () {
          return []
        }
      }
    },
    data: function () {
      return {
        show: true,
        disableAlertTimeout: undefined
      }
    },
    mounted: function () {
      var vm = this
      this.disableAlertTimeout = setTimeout(
        function () {
          vm.show = false
        },
        3000
      )
    },
    beforeDestroy () {
      clearTimeout(this.disableAlertTimeout)
    }
  }
</script>

<style>
  .fade-leave-active {
    transition: opacity 2s ease;
    -webkit-transition: opacity 2s ease;
  }
  .fade-enter-active {
    opacity: 0.5 !important;
  }
  .fade-enter {
    opacity: 0.5 !important;
  }
  .fade-leave-to {
    opacity: 0;
  }
</style>
