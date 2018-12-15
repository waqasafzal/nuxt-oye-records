<template>
  <dropdown 
    :values="values" 
    class="genres__detail__subgenre__selector" 
    @selected="onSelected">{{ selectedGenreName }}</dropdown>
</template>

<script>
// import apolloClient from '~/plugins/apollo'
import gql from 'graphql-tag'
import Dropdown from '../shared/Dropdown'

export default {
  name: 'MetaGenreFilter',
  components: { Dropdown },
  data: function() {
    return {
      genres: [],
      selectedGenreName: 'Select Genre'
    }
  },
  computed: {
    values() {
      return this.genres
    }
  },
  mounted() {
    this.$apollo
      .query({
        query: gql`
          query MetaGenres {
            metaGenres {
              name
              slug
            }
          }
        `
      })
      .then(({ data }) => {
        this.genres = data.metaGenres
      })
  },
  methods: {
    onSelected(value) {
      this.$emit('genre-selected', value)
      this.selectedGenreName = value.name
    }
  }
}
</script>
