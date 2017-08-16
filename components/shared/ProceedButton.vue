<template>
  <button class="btn primary proceed-btn" @click="onClick">
    <div class="proceed-btn__content">
      <div class="proceed-btn__text">
        <slot></slot>
      </div>
      <right-arrow class="proceed-right"></right-arrow>
    </div>
  </button>
</template>

<script>
  import RightArrow from './RightArrow'
  export default {
    components: {RightArrow},
    name: 'ProceedButton',
    methods: {
      onClick: function () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .proceed-btn {
    color: white;
    background-color: #30C46C;
    position: relative;
    height: 56px;
    line-height: 56px;
    display: inline-block;
    font-size: 20px;
    padding: 0 4rem !important;
    &__content {
      display: flex;
      flex-direction: row;
      position: relative;
      margin-top: auto;
      margin-bottom: auto;
      justify-content: space-around;
    }
    &__text {
      margin-left: auto;
    }
    .proceed-right {
      margin-bottom: auto;
      margin-top: auto;
      height: 15px;
      margin-left: 8px;
      margin-right: auto;
    }
  }
</style>
