<template>
  <div class="account__artists__section" v-if="user.artists && user.artists.length > 0">
    <h3>Your Artists</h3>
    <div class="account__artists row">
      <div class="account__artist col-md-6" v-for="artist in user.artists">
        <nuxt-link :to="{name: 'account-artists-slug', params: {slug: artist.slug}}">
          <img :src="artist.thumbnailUrl"/>
          <div>{{ artist.name }}</div>
          <div>{{ artist.homeLabel }}</div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyArtists',
    computed: {
      user () {
        return this.$store.state.user
      }
    }
  }
</script>
