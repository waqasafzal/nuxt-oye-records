<template>
  <div :class="['announcement', `alert-list__${announcement.priority}`]">
    <div class="announcement-close" @click="close">&times;</div>
    <div class="announcement-text" v-html="announcement.message"></div>
  </div>
</template>

<script>
  export default {
    name: 'AnnouncementItem',
    props: {
      announcement: Object
    },
    methods: {
      close () {
        let readAnnouncements = window.localStorage.getItem('announcements')
        let announcements = readAnnouncements ? JSON.parse(readAnnouncements) : []
        announcements.push(this.announcement.message)
        window.localStorage.setItem('announcements', JSON.stringify(announcements))
        this.$store.commit('REMOVE_ANNOUNCEMENT', this.announcement)
      }
    }
  }
</script>

<style lang="scss">
  .announcement {
    max-width: 320px;
    padding: 16px 32px 16px 16px;
    position: relative;
    border-radius: 4px;
    &-close {
      position: absolute;
      top: -8px;
      right: 8px;
      padding: 2px;
      font-size: 28px;
      cursor: pointer;
      &:hover {
        color: darken(#fff, 5);
      }
    }
    a {
      text-decoration: underline;
      color: inherit;
    }
  }
</style>
