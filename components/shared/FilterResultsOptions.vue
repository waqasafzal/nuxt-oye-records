<template>
  <div class="filter-options">
    <button 
      class="btn" 
      @click="toggleModal">&#43; Filter Results</button>
    <div 
      v-show="showModal" 
      ref="modal-screen" 
      class="modal-screen">
      <div class="filter-modal">
        <div class="filter-modal__header">
          <h4>Filter Results</h4>
          <div 
            class="close float-right" 
            @click="toggleModal">&times;</div>
        </div>
        <div class="row filter-modal__body">
          <div class="col-12 col-md-3">
            <div class="filter-criterion">
              <div class="filter-criterion__header">Format</div>
              <div class="filter-criterion__options">
                <form>
                  <div class="form-group">
                    <label 
                      for="format-all" 
                      class="checkbox-label"><input 
                        id="format-all" 
                        v-model="allFormats"
                        type="checkbox"
                        @click="onClickAll">All</label>
                  </div>
                  <div class="row">
                    <div
                      v-for="(f, fi) in formats"
                      :key="`format-${fi}`"
                      class="form-group col-6 col-md-12">
                      <input 
                        :id="`format-${f}`" 
                        :value="f" 
                        v-model="selectedFormats"
                        style="height: 16px;"
                        type="checkbox" 
                        @click="onCheckboxClick">
                      <label 
                        :for="`format-${f}`" 
                        class="checkbox-label">{{ f }}</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="filter-criterion">
              <div class="filter-criterion__header">Date</div>
              <div class="filter-criterion__options">
                <div 
                  v-for="(value, key) in daysOptions" 
                  :key="`days-${key}`">
                  <input 
                    :value="parseInt(key)" 
                    :id="`days-${key}`" 
                    v-model="days" 
                    type="radio" 
                    name="days" 
                    @click="setDay">
                  <label :for="`days-${key}`">{{ value }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const formats = [
  'Vinyl',
  'CD',
  'Cassette',
  'DJ Equipment',
  'Merchandise',
  'Magazine / Book'
]

export default {
  name: 'FilterResultsOptions',
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
    },
    upcoming: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      showModal: false,
      selectedFormats: formats,
      formats: formats,
      allFormats: true,
      days: [],
      lastClicked: null
    }
  },
  computed: {
    currentOptions() {
      return {
        days: this.days,
        formats: this.selectedFormats
      }
    }
  },
  watch: {
    selectedFormats(val) {
      if (val.length !== formats.length) {
        this.allFormats = false
      }
    },
    allFormats(val) {
      if (val) {
        for (var i = 0; i < formats.length; i++) {
          if (!this.selectedFormats.includes(formats[i])) {
            this.selectedFormats.push(formats[i])
          }
        }
      } else {
        this.selectedFormats = []
        if (this.lastClicked) {
          this.selectedFormats.push(this.lastClicked)
        }
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal
      if (this.showModal) {
        this.lastOptions = this.currentOptions
      } else if (
        JSON.stringify(this.lastOptions) !== JSON.stringify(this.currentOptions)
      ) {
        this.$emit('filter-changed', this.currentOptions)
        this.showModal = false
      } else {
        this.$emit('filter-changed', this.lastOptions)
      }
    },
    onKeyDown(e) {
      var key = e.keyCode ? e.keyCode : e.which
      if (key === 27) {
        this.showModal = false
      }
    },
    onCheckboxClick(e) {
      this.lastClicked = e.target.value
      setTimeout(this.toggleModal, 50)
    },
    onClickAll(e) {
      if (this.lastClicked) {
        setTimeout(this.toggleModal, 50)
      }
      this.lastClicked = null
    },
    setDay(day) {
      setTimeout(this.toggleModal, 100)
    }
  }
}
</script>
