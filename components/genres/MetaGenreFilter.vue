<template>
  <dropdown @selected="onSelected" class="genres__detail__subgenre__selector" :values="values">{{selectedGenreName}}</dropdown>
</template>

<script>
  import apolloClient from '~/plugins/apollo'
  import gql from 'graphql-tag'
  import Dropdown from '../shared/Dropdown'

  export default {
    components: {Dropdown},
    name: 'MetaGenreFilter',
    data: function () {
      return {
        genres: [],
        selectedGenreName: 'Select Genre'
      }
    },
    computed: {
      values () {
        return this.genres
      }
    },
    methods: {
      onSelected (value) {
        this.$emit('genre-selected', value)
        this.selectedGenreName = value.name
      }
    },
    mounted () {
      apolloClient.query({
        query: gql`query MetaGenres {
           metaGenres {
              name
              slug
           }
        }
        `
      }).then(
        ({data}) => {
          this.genres = data.metaGenres
        }
      )
    }
  }
</script>
