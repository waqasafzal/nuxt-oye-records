<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="page__header">Browse Genres</div>
        <div class="genres__menu">
          <div class="genres__menu__column" :style="genresMenuColumnStyle" :key="i" v-for="(mainGenre, i) in metaGenres">
            <div class="genres__menu__column__head">
              {{ mainGenre.name }}
            </div>
            <div class="genres__menu__column__body">
              <template v-for="(genre, j) in mainGenre.genres">
                <template v-if="genre.parentGenre">
                  <nuxt-link class="genres__menu__column__body__item"
                               v-if="genre.parentGenre.name != genre.name"
                               :to="{name: 'genres-slug-subslug', params: {slug: genre.parentGenre.slug, subslug: genre.slug, genre: genre}}">
                    {{ genre.name }}
                  </nuxt-link>
                </template>
                <template v-else>
                  <nuxt-link
                      class="genres__menu__column__body__item"
                      :to="{name: 'genres-slug', params: {slug: genre.slug, genre: genre}}">{{ genre.name }}</nuxt-link>
                </template>
                <!--<template v-for="(subGenre, k) in genre.subgenres">-->
                <!--</template>-->
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" :key="i" v-for="(genre, i) in metaGenres">
      <release-list-summary :releases="genre.releases" pageSize="2" status="new" :title="genre.name" :genre="genre"></release-list-summary>
    </div>
  </div>
</template>

<script>
  //  import {mainGenres} from '../../components/graphql/genres'
  //  import gql from 'graphql-tag'
  import client from '../../plugins/apollo'
  import ReleaseListSummary from '../../components/releases/ReleaseListSummary'
  import { createMainGenresQuery } from '../../components/genres/queries'
//  import { createReleaseListQuery } from '../../components/releases/queries'

  export default {
    components: {ReleaseListSummary},
    name: 'GenreOverviewPage',
    data: function () {
      return {
        metaGenres: [],
        genreReleases: {}
      }
    },
    computed: {
      genresColumnWidth: function () {
        return Math.floor(12 / this.metaGenres.length)
      },
      genresMenuColumnStyle: function () {
        return {
          width: (100 / this.metaGenres.length) + '%'
        }
      }
    },
    async asyncData ({params}) {
      let genres = await client.query(createMainGenresQuery(12))
      let metaGenres = genres.data.metaGenres
      return {
        metaGenres: metaGenres
      }
    }
  }
</script>
