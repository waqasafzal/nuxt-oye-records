<template>
  <div class="release-filter-panel">
    <div class="release-filter-panel__controls">
      <div @click="collapse" class="genre-dropdown__button">
        <template v-if="changeGenre"><slot>Change</slot></template>
        <template v-else>Select genre</template>
        <div :class="['filled-arrow__box']">
          <div :class="['filled-arrow__arrow', collapsed ? 'rotate180' : '']"></div>
        </div>
      </div>
      <filter-results-options :daysOptions="daysOptions" @filter-changed="setOptions"></filter-results-options>
    </div>
    <div :class="['genre-dropdown__content', collapsed ? 'collapsed': '']">
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
                <div @click="routeTo(genre, true)" class="expandable__details__item"
                           v-if="genre.parentGenre.name != genre.name">
                  {{ genre.name }}
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import FilterResultsOptions from '../../shared/FilterResultsOptions'

  export default {
    components: {
      FilterResultsOptions
    },
    name: 'ReleaseFilterPanel',
    props: {
      metaGenres: Array,
      changeGenre: Boolean,
      filterOnly: {
        type: Boolean,
        default: false
      },
      daysOptions: {
        type: Object,
        default: () => {
          return {
            '7': 'Last 7 days',
            '14': 'Last 14 days',
            '31': 'Last month',
            '365': 'Last year'
          }
        }
      }
    },
    data () {
      return {
        selected: -1,
        collapsed: true, // !this.expanded
        showModal: false
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
      routeTo (genre, isSubslug = false) {
        this.collapse()
        if (!this.filterOnly) {
          if (!isSubslug) {
            this.$router.push({name: 'metagenres-slug', params: {slug: genre.slug}})
          } else {
            this.$router.push({name: 'genres-slug-subslug', params: {slug: genre.parentGenre.slug, subslug: genre.slug, genre: genre}})
          }
        } else {
          this.$emit('genre-selected', genre)
        }
      },
      collapse () {
        console.log('collapse')
        const oldState = this.collapsed
        this.collapsed = !oldState
        if (this.collapsed) {
          this.$emit('collapsed', oldState)
        }
      },
      collapseAll () {
        this.selected = -1
        this.collapsed = true
      },
      setOptions (options) {
        this.$emit('filter-changed', options)
        console.log(`setOptions${JSON.stringify(options)}`)
      }
    }
  }
</script>

<style lang="scss">
  .release-filter-panel {
    width: 100%;
    flex-direction: column;
    padding-bottom: 1rem;

    &__controls {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }
    .genre-dropdown {
      /*display: flex;*/

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
        width: 50%;
        height: 42px;
        min-width: inherit;
        max-width: inherit;
        margin-right: 15px;
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
    .filter-options {
      margin-bottom: 0;
      width: 50%;
      margin-left: 8px;
      .btn {
        height: 42px;
        opacity: .6;
        border-radius: 4px;
        padding: 1em 2em !important
      }
    }
  }
</style>

<!--$gray-color-1: #989A98;-->
<!--$gray-color-2: #EBE9E6;-->
<!--$gray-color-3: #F3F2EF;-->
<!--$gray-color-4: #F8F7F5;-->
<!--$gray-color-5: #FBFBFA;-->
