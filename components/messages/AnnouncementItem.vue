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
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    padding: 8px;
    position: relative;
    &-close {
      position: absolute;
      top: -2px;
      right: 16px;
      padding: 2px;
      font-size: 28px;
      cursor: pointer;
      &:hover {
        top: -4px;
        transform: scale(1.5);
      }
    }
  }
</style>
