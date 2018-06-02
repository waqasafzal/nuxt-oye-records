<template>
  <div class="genre-dropdown">
    <div @click="collapse" class="genre-dropdown__button">
      Select genre
      <div :class="['filled-arrow__box']">
        <div :class="['filled-arrow__arrow', collapsed ? 'rotate180' : '']"></div>
      </div>
    </div>
    <div @click.stop :class="['genre-dropdown__content', collapsed ? 'collapsed': '']">
      <div class="genre-dropdown__metagenre" :key="i"
           v-for="(mainGenre, i) in metaGenres">
        <div class="genre-dropdown__maingenre">
          <div class="expandable">
            <div @click="toggleSelected(i)" class="expandable__header">
              <div class="genre-name" @click="routeTo(mainGenre)">{{ mainGenre.name }}</div>
              <div class="arrow-box">
                <div :class="['arrow', selected !== i  ? 'arrow-down' : 'arrow-up']"></div>
              </div>
            </div>
            <div :class="['expandable__details', selected !== i ? 'collapsed': '']">
              <template v-for="(genre, j) in mainGenre.genres">
                <template v-if="genre.parentGenre">
                  <nuxt-link class="expandable__details__item"
                             v-if="genre.parentGenre.name != genre.name"
                             :to="{name: 'genres-slug-subslug', params: {slug: genre.parentGenre.slug, subslug: genre.slug, genre: genre}}">
                    {{ genre.name }}
                  </nuxt-link>
                </template>
                <template v-else>
                  <nuxt-link class="expandable__details__item"
                             :to="{name: 'genres-slug', params: {slug: genre.slug, genre: genre}}">
                    {{ genre.name }}
                  </nuxt-link>
                </template>
              </template>
            </div>
          </div>
          <!--<nuxt-link :to="{name: 'metagenres-slug', params: {slug: mainGenre.slug}}">{{ mainGenre.name }}</nuxt-link>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GenreDropdown',
    props: {
      metaGenres: Array,
      expanded: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selected: -1,
        collapsed: true // !this.expanded
      }
    },
    methods: {
      toggleSelected (i) {
        if (this.selected === i) {
          this.selected = -1
        } else {
          this.selected = i
        }
      },
      routeTo (mainGenre) {
        this.$router.push({name: 'metagenres-slug', params: {slug: mainGenre.slug}})
      },
      collapse () {
        const oldState = this.collapsed
        this.collapsed = !oldState
        if (this.collapsed) {
          this.$emit('collapsed', oldState)
        }
      }
    }
  }
</script>

<style lang="scss">
  .genre-dropdown {
    &__content {
      background-color: #313532;
      color: white !important;
      margin-top: 1rem;
      a {
        color: white !important;
      }
      width: 100%;
    }
    &__button {
      background-color: #313532;
      color: white !important;
      border-radius: 4px;
      padding: 8px;
      position: relative;
      min-width: 120px;
      max-width: 120px;
    }
    &__metagenre {
      border-bottom: 1px solid #989A98;
      &:last-child {
        border-bottom: 0;
      }
    }
    &__maingenre {
      padding-bottom: 0;
      .expandable {
        &__header {
          display: flex;
          padding: 24px;
        }
        &__details {
          padding: 24px;
          &__item {
            display: block;
            padding-top: 10px;
            padding-bottom: 10px;
          }
          background-color: rgba(0, 0, 0, 0.1);
          a {
            color: rgba(255, 255, 255, 0.6) !important;
          }
        }
      }
      .genre-name {
        cursor: pointer;
      }
    }
    .arrow {
      border-width: 0 1px 1px 0 !important;
      padding: 3px !important;
      &-box {
        margin-right: 0 !important;
      }
    }
  }
  .collapsed {
    display: none;
  }
  .arrow {
    border: solid white;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 3px;
    &-box {
      margin-left: auto;
      /*margin-right: 16px;*/
      margin-top: auto;
      margin-bottom: auto;
    }
    &-down {
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
    }
    &-up {
      transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);
    }
  }

  .filled-arrow {
    &__box {
      position: absolute;
      right: 0;
      top: 0;
      float: right;
      height: 100%;
      width: 20%;
    }
    &__arrow {
      width: 0;
      height: 0;
      border-radius: 2px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #fff;
      position: relative;
      left: 40%;
      top: 45%;
    }
  }
  .rotate180 {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
  .page__header {
    .genre-dropdown {
      margin-top: 24px;
      margin-bottom: auto;
      width: 100%;
    }
  }

</style>
