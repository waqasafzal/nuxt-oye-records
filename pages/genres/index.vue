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
                <nuxt-link
                    class="genres__menu__column__body__item"
                    :to="{name: 'genres-slug', params: {slug: genre.slug, genre: genre}}">{{ genre.name }}</nuxt-link>
                <template v-for="(subGenre, k) in genre.subgenres">
                  <nuxt-link class="genres__menu__column__body__item"
                               v-if="subGenre.name != genre.name"
                               :to="{name: 'genres-slug-subslug', params: {slug: genre.slug, subslug: subGenre.slug, genre: subGenre}}">
                    {{ subGenre.name }}
                  </nuxt-link>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" :key="i" v-for="(genre, i) in metaGenres">
      <release-list-summary :releases="genreReleases[genre.name]" pageSize="2" status="new" :title="genre.name" :genre="genre"></release-list-summary>
    </div>
  </div>
</template>

<script>
  //  import {mainGenres} from '../../components/graphql/genres'
  //  import gql from 'graphql-tag'
  import client from '../../plugins/apollo'
  import ReleaseListSummary from '../../components/releases/ReleaseListSummary'
  import { createMainGenresQuery } from '../../components/genres/queries'
  import { createReleaseListQuery } from '../../components/releases/queries'

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
      let genres = await client.query(createMainGenresQuery())
      let metaGenres = genres.data.metaGenres
      var genreReleases = {}
      for (var i = 0; i < metaGenres.length; i++) {
        let genre = metaGenres[i]
        let options = {
          first: 12,
          filterBy: JSON.stringify({
            genres: genre.genres.map(x => x.slug)
          })
        }
        let releaseListResult = await client.query(createReleaseListQuery(options))
        let releases = releaseListResult.data.releases
        genreReleases[genre.name] = releases
      }
      return {
        metaGenres: metaGenres,
        genreReleases: genreReleases
      }
    }
//    apollo: {
//      // Query with parameters
//      metaGenres () {
//        return {
//          query: gql`query MainGenres {
//            metaGenres {
//              ...MainGenres
//            }
//          }
//          ${mainGenres}
//          `,
//          variables () {
//            return {
//              first: this.count,
//              filterBy: this.filterBy
//            }
//          },
//          loadingKey: 'loadingQueriesCount',
//          loadingChangeCb (isLoading, countModifier) {
//            this.loading = isLoading
//          }
//        }
//      }
//    }
  }
</script>
