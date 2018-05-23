<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header"><h1>Browse Genres</h1></div>
        <div class="genres__menu d-none d-lg-flex">
          <div class="genres__menu__column" :style="genresMenuColumnStyle" :key="i"
               v-for="(mainGenre, i) in metaGenres">
            <div class="genres__menu__column__head">
              <nuxt-link :to="{name: 'metagenres-slug', params: {slug: mainGenre.slug}}">{{ mainGenre.name }}</nuxt-link>
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
                      :to="{name: 'genres-slug', params: {slug: genre.slug, genre: genre}}">{{ genre.name }}
                  </nuxt-link>
                </template>
              </template>
            </div>
          </div>
        </div>
        <!--<release-filter-panel @filter-changed="setFilterOptions" :changeGenre="false" :metaGenres="metaGenres" class="d-flex d-md-none">-->
          <!--&lt;!&ndash;<template v-if="detailGenre">{{detailGenre.name}}</template>&ndash;&gt;-->
        <!--</release-filter-panel>-->
        <!--<release-filter-panel></release-filter-panel>-->
        <genre-dropdown class="d-md-none" :metaGenres="metaGenres"></genre-dropdown>
      </div>
    </div>
    <release-list-summary :releases="genre.releases"
                          pageSize="2"
                          status="new"
                          :title="genre.name"
                          :genre="genre"
                          :key="i"
                          v-for="(genre, i) in metaGenres">

      <nuxt-link :to="{name: 'metagenres-slug', params: {slug: genre.slug}}">Latest {{ genre.name }}</nuxt-link>
    </release-list-summary>
  </div>
</template>

<script>
  import client from '../../plugins/apollo'
  import ReleaseListSummary from '../../components/releases/ReleaseListSummary'
  import { createMainGenresQuery } from '../../components/genres/queries'
  import GenreDropdown from '../../components/features/mobile/GenreDropdown'
  import ReleaseFilterPanel from '../../components/features/mobile/ReleaseFilterPanel'

  export default {
    components: {
      ReleaseFilterPanel,
      GenreDropdown,
      ReleaseListSummary
    },
    name: 'GenreOverviewPage',
    data: function () {
      return {
        metaGenres: [],
        genreReleases: {}
      }
    },
    head () {
      return {
        title: 'OYE Records - Genres',
        meta: [
          {
            hid: 'title',
            property: 'og:title',
            content: 'OYE Records - Genres'
          }
        ]
      }
    },
    computed: {
      genresMenuColumnStyle: function () {
        return {
//          width: (100 / this.metaGenres.length) + '%'
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
