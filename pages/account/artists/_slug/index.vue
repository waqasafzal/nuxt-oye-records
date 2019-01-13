<template>
  <div class="page container-fluid">
    <div class="page__header">Your artist <strong>{{ artist.name }}</strong></div>
    <div class="artist__image">
      <div>
        <h3>Image</h3>
      </div>
      <div class="artist__image__edit-box">
        <template v-if="artistImage && !changeImageMode">
          <img :src="artistImage" >
        </template>
        <template v-else>
          <dropzone 
            id="myVueDropzone" 
            :max-number-of-files="1"
            :headers="headers"
            class="dropzone"
            width="610px"
            height="208px" 
            url="/oye/image/"
            @vdropzone-success="substituteImageUrl"
          >
            <input 
              :value="imageUploadPayload" 
              type="hidden" 
              name="payload">
          </dropzone>
        </template>
        <div 
          v-if="artist.thumbnailUrl" 
          class="button" 
          @click="toggleEditImage">
          Change
        </div>
      </div>
    </div>
    <div class="artist__charts">
      <h3>Charts</h3>
      <charts-editor :artist="artist"/>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
// import client from '~/plugins/apollo'
import gql from 'graphql-tag'
import { getCurrentMonth } from '~/utils/date'
import * as types from '~/store/types'
import { getAuthHeader } from '~/utils/auth/index'
import ChartsEditor from '~/components/charts/ChartsEditor'

let component = {}
if (process.browser) {
  component = require('vue2-dropzone')
}
component.name = 'dropzone'
component.render = function(createElement) {
  const that = this._self
  return createElement(
    'form',
    {
      attrs: {
        class: 'dropzone',
        id: that.id || '',
        action: that.url || '' || __API__ + '/oye/image/'
      }
    },
    this.$slots.default
  )
}
Vue.component('dropzone', component)

export default {
  name: 'AccountArtist',
  components: { ChartsEditor },
  middleware: ['auth-artist'],
  data: function() {
    var slug = this.$route.params['slug']
    var user = this.$store.state.user
    var artists = user.artists
    var artist
    if (artists) {
      for (var i = 0; i < artists.length; i++) {
        if (artists[i].slug === slug) {
          artist = artists[i]
          break
        }
      }
    }
    return {
      artist: artist,
      changeImageMode: false,
      artistImage: artist.image
    }
  },
  computed: {
    headers() {
      if (process.browser) {
        var jwt = this.$cookie.get('jwt')
        if (jwt) {
          var header = getAuthHeader(this)
          return {
            Authorization: header
          }
        }
      }
    },
    user: function() {
      return this.$store.state.user
    },
    imageUploadPayload: function() {
      return JSON.stringify({
        target: {
          type: 'artist',
          slug: this.artist.slug
        }
      })
    }
  },
  mounted() {
    var artist = this.artist
    if (typeof artist.name === 'undefined') {
      const slug = this.$route.params['slug']
      this.$apollo
        .query({
          query: gql`
            query Artist($slug: String!, $month: Int!) {
              artist(slug: $slug) {
                pk
                thumbnailUrl(width: 1200, height: 300)
                slug
                name
                charts(month: $month) {
                  edges {
                    node {
                      releases {
                        release {
                          slug
                          artistFirstName
                          artistLastName
                          title
                          label
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            month: getCurrentMonth().value,
            slug: slug
          }
        })
        .then(({ data }) => {
          this.$store.commit(types.UPDATE_USER_ARTIST, {
            artist: data.artist
          })
          this.artist = data.artist
          this.artistImage = data.artist.thumbnailUrl
        })
    }
  },
  methods: {
    toggleEditImage: function() {
      this.changeImageMode = !this.changeImageMode
    },
    substituteImageUrl: function(file, response) {
      this.artistImage = response.url
      this.changeImageMode = false
    }
  }
}
</script>
