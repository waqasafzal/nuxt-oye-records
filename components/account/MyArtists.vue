
<template>
  <div 
    v-if="user.artists && user.artists.length > 0" 
    class="account__artists__section">
    <div class="account__artists row">
      <div 
        v-for="(artist, ai) in user.artists"
        :key="`artist-${ai}`"
        class="account__artist col-md-6">
        <nuxt-link :to="{name: 'account-artists-slug', params: {slug: artist.slug}}">
          <img :src="artist.thumbnailUrl">
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
    user() {
      return this.$store.state.user
    }
  }
}
</script>
