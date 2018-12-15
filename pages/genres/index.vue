<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="page__header"><h1>Browse Genres</h1></div>
        <div class="genres__menu d-none d-lg-flex">
          <div 
            v-for="(mainGenre, i) in metaGenres"
            :key="i"
            class="genres__menu__column">
            <div class="genres__menu__column__head">
              <nuxt-link :to="{name: 'metagenres-slug', params: {slug: mainGenre.slug}}">{{ mainGenre.name }}</nuxt-link>
            </div>
            <div class="genres__menu__column__body">
              <template 
                v-for="(genre, j) in mainGenre.genres">
                <template v-if="genre.parentGenre">
                  <nuxt-link 
                    v-if="genre.parentGenre.name != genre.name"
                    :key="`sub-genre-${j}`"
                    :to="{name: 'genres-slug-subslug', params: {slug: genre.parentGenre.slug, subslug: genre.slug, genre: genre}}"
                    class="genres__menu__column__body__item">
                    {{ genre.name }}
                  </nuxt-link>
                </template>
                <template v-else>
                  <nuxt-link 
                    :key="`main-genre-${j}`"
                    :to="{name: 'genres-slug', params: {slug: genre.slug, genre: genre}}"
                    class="genres__menu__column__body__item">{{ genre.name }}
                  </nuxt-link>
                </template>
              </template>
            </div>
          </div>
        </div>
        <genre-dropdown 
          :meta-genres="metaGenres" 
          class="d-md-none"/>
      </div>
    </div>
    <release-list-summary 
      v-for="(genre, i) in metaGenres"
      :releases="genre.releases"
      :title="genre.name"
      :genre="genre"
      :key="i"
      :page-size="2"
      status="new">

      <nuxt-link :to="{name: 'metagenres-slug', params: {slug: genre.slug}}">Latest {{ genre.name }}</nuxt-link>
    </release-list-summary>
  </div>
</template>

<script>
import ReleaseListSummary from '../../components/releases/ReleaseListSummary'
import { createMainGenresQuery } from '../../components/genres/queries'
import GenreDropdown from '../../components/features/mobile/GenreDropdown'
import ReleaseFilterPanel from '../../components/features/mobile/ReleaseFilterPanel'

export default {
  name: 'GenreOverviewPage',
  components: {
    ReleaseFilterPanel,
    GenreDropdown,
    ReleaseListSummary
  },
  data: function() {
    return {
      genreReleases: {}
    }
  },
  head() {
    return {
      title: 'OYE Records - Genres',
      meta: [
        {
          hid: 'title',
          property: 'og:title',
          content: 'OYE Records - Genres'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Discover releases from more than 200 genres and subgenres.'
        }
      ]
    }
  },
  async asyncData ({app}) {
    const client = app.apolloProvider.clients.defaultClient
    const {data} = await client.query({...createMainGenresQuery(12)})
    return {
      metaGenres: data.metaGenres
    }
  }

}
</script>
