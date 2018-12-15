<template>
  <div class="dropdown">
    <div class="dropdown__button">
      <slot/>
      <div class="dropdown__button__arrow-box">
        <div class="dropdown__button__arrow"/>
      </div>
    </div>
    <div :class="['dropdown__values', hidden ? 'hidden': '']">
      <div
        v-for="(value, i) in selectableValues"
        :key="`dropdown-item-${i}`"
        class="dropdown__values__item"
        @click="onSelected(value)"
      >
        {{ display(value) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      default: null
    },
    values: {
      type: Array,
      default: () => []
    },
    nameKey: {
      type: String,
      default: 'name'
    }
  },
  data: function() {
    return {
      hidden: false,
      hideDropdownTimeout: null
    }
  },
  computed: {
    selectableValues() {
      let selectable = []
      for (var i = 0; i < this.values.length; i++) {
        if (this.values[i] !== this.selected) {
          selectable.push(this.values[i])
        }
      }
      return selectable
    }
  },
  watch: {
    hidden(value) {
      clearTimeout(this.hideDropdownTimeout)
      var vm = this
      if (value) {
        this.hideDropdownTimeout = setTimeout(function() {
          vm.hidden = false
        }, 300)
      }
    }
  },
  methods: {
    display(data) {
      if (data.hasOwnProperty(this.nameKey)) {
        return data[this.nameKey]
      }
      return data
    },
    onSelected(value) {
      this.$emit('selected', value)
      this.selected = value
      this.hidden = true
    }
  },
  beforeDestroyed() {
    clearTimeout(this.hideDropdownTimeout)
  }
}
</script>

<style lang="scss">
.dropdown {
  position: relative;
  /*display: inline-block !important;*/
  &:hover {
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    .dropdown__values {
      display: block;
      &.hidden {
        display: none;
      }
    }
    .dropdown__button {
      opacity: 0.6;
    }
  }
  &__button {
    position: relative;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    width: 100%;
    &__arrow-box {
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
      border-top: 5px solid black;
      position: relative;
      left: 40%;
      top: 45%;
    }
  }
  &__values {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 160px;
    width: 100%;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    max-height: 300px;
    overflow-y: scroll;

    &__item {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      width: 100%;
      border-top: 1px solid #f0f0f0 !important;
      border-left: 1px solid #f0f0f0 !important;
      border-right: 1px solid #f0f0f0 !important;

      &:hover {
        background-color: #f1f1f1;
        cursor: pointer;
      }
    }
  }
}
</style>
