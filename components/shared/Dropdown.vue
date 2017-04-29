<template>
  <div class="dropdown">
    <div class="dropdown__button">
      <slot></slot>
      <div class="dropdown__button__arrow-box">
        <div class="dropdown__button__arrow"></div>
      </div>
    </div>
    <div class="dropdown__values">
      <div class="dropdown__values__item"
           v-for="value in values"
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
      title: String,
      values: {
        type: Array,
        default: []
      },
      nameKey: {
        type: String,
        default: 'name'
      }
    },
    methods: {
      display (data) {
        if (data.hasOwnProperty(this.nameKey)) {
          return data[this.nameKey]
        }
        return data
      },
      onSelected (value) {
        console.log('sss' + value)
        this.$emit('selected', value)
      }
    }
  }
</script>

<style lang="scss">
  .dropdown {
    position: relative;
    display: inline-block;
    &:hover {
      border-bottom-right-radius: 0px;
      border-bottom-left-radius: 0px;
      .dropdown__values {
        display: block;
      }
      .dropdown__button {
        opacity: 0.6;
      }
    }
    &__button {
      position: relative;
      background-color: #4CAF50;
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
      box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.2);
      z-index: 1;
      max-height: 250px;
      overflow-y: scroll;

      &__item {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        width: 100%;
        border-top: 1px solid #F0F0F0 !important;
        border-left: 1px solid #F0F0F0 !important;
        border-right: 1px solid #F0F0F0 !important;

        &:hover {
          background-color: #f1f1f1;
          cursor: pointer;
        }
      }
    }
  }
</style>
