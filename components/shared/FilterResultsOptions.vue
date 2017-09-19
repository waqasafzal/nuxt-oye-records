<template>
  <div class="filter-options">
    <button class="btn" @click="toggleModal">&#43; Filter Results</button>
    <!--<transition :duration="1000" name="unfold">-->
      <div class="modal-screen" ref="modal-screen" v-show="showModal">
        <div class="filter-modal">
          <div class="filter-modal__header">
            <h4>Filter Results</h4>
            <div @click="toggleModal" class="close float-right">&times;</div>
          </div>
          <div class="row filter-modal__body">
            <div class="col-12 col-md-3">
              <div class="filter-criterion">
                <div class="filter-criterion__header">Format</div>
                <div class="filter-criterion__options">
                  <form>
                    <div class="form-group">
                      <label for="format-all" class="checkbox-label"><input type="checkbox" id="format-all"
                                                                            v-model="allFormats"/>All</label>
                    </div>
                    <div class="form-group" v-for="f in formats">
                      <label :for="`format-${f}`" class="checkbox-label"><input type="checkbox" :id="`format-${f}`"
                                                                                :value="f" v-model="selectedFormats"/>{{f}}</label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="filter-criterion">
                <div class="filter-criterion__header">Date</div>
                <div class="filter-criterion__options">
                  <div v-for="value, key in daysOptions">
                    <input type="radio" name="days" :value="parseInt(key)" :id="`days-${key}`" v-model="days"/>
                    <label :for="`days-${key}`">{{value}}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!--</transition>-->
  </div>
</template>

<script>
  const formats = ['Vinyl', 'CD', 'Cassette', 'DJ Equipment', 'Merchandise', 'Magazine / Book']

  export default {
    name: 'FilterResultsOptions',
    data: function () {
      return {
        showModal: false,
        selectedFormats: formats,
        formats: formats,
        allFormats: true,
        days: []
      }
    },
    props: {
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
    computed: {
      currentOptions () {
        return {
          days: this.days,
          formats: this.selectedFormats
        }
      }
    },
    watch: {
      selectedFormats (val) {
        if (val.length !== formats.length) {
          this.allFormats = false
        }
      },
      allFormats (val) {
        if (val) {
          for (var i = 0; i < formats.length; i++) {
            if (!this.selectedFormats.includes(formats[i])) {
              this.selectedFormats.push(formats[i])
            }
          }
        } else {
          this.selectedFormats = []
        }
      }
    },
    methods: {
      toggleModal () {
        this.showModal = !this.showModal
        if (this.showModal) {
          this.lastOptions = this.currentOptions
        } else if (JSON.stringify(this.lastOptions) !== JSON.stringify(this.currentOptions)) {
          this.$emit('filter-changed', this.currentOptions)
        }
      },
      onKeyDown (e) {
        var key = e.keyCode ? e.keyCode : e.which
        if (key === 27) {
          this.showModal = false
        }
      }
    },
    mounted () {
      document.addEventListener('keydown', this.onKeyDown)
    },
    beforeDestroy () {
      document.removeEventListener('keydown', this.onKeyDown)
    }
  }
</script>
