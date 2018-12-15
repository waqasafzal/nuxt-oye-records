<template>
  <transition name="announcements">
    <div 
      v-if="showAnnouncements && announcements" 
      class="announcements">
      <announcement-item 
        v-for="(item, i) in announcements" 
        :key="`${item.priority}-${i}`" 
        :announcement="item"/>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import AnnouncementItem from './AnnouncementItem'
export default {
  name: 'Announcements',
  components: { AnnouncementItem },
  data() {
    return {
      showAnnouncements: false
    }
  },
  computed: {
    ...mapGetters(['announcements'])
  },
  mounted() {
    let vm = this
    setTimeout(function() {
      vm.showAnnouncements = true
    }, 15000)
  }
}
</script>

<style>
.announcements {
  z-index: 60;
  position: fixed;
  bottom: 8px;
  left: 8px;
  display: flex;
  padding-left: 8px;
}
.announcements-enter-active {
  animation: slideDown 1s;
}
.announcements-leave-active {
  animation: slideDown 1s reverse;
}

@keyframes slideDown {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(-8%);
  }
  65% {
    transform: translateY(4%);
  }
  80% {
    transform: translateY(-4%);
  }
  95% {
    transform: translateY(2%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
