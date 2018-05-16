<template>
  <div id="genre-dropdown">
    <div class="genres__menu__column" :key="i"
         v-for="(mainGenre, i) in metaGenres">
      <div class="genres__menu__column__head">
        <nuxt-link :to="{name: 'metagenres-slug', params: {slug: mainGenre.slug}}">{{ mainGenre.name }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GenreDropdown',
    props: {
      metaGenres: Object
    }
  }
</script>

<style>
  #genre-dropdown {
    background-color: #313532;
    color: white;
  }
</style>
