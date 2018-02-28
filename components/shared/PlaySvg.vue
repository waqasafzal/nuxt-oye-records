<template>
  <svg class="play-svg" viewBox="0 0 11 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
    <title>icon/play-white</title>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="New-Releases" transform="translate(-607.000000, -505.000000)" fill="#FFFFFF">
        <g id="Group-3" transform="translate(504.000000, 405.000000)">
          <g id="Group-2" transform="translate(82.500000, 82.500000)">
            <g id="Button-/-Play-Large">
              <polygon id="icon/play-white" transform="translate(22.707420, 24.692726) rotate(-315.000000) translate(-22.707420, -24.692726) " points="16.6197683 21.3686447 28.795072 18.7466476 26.1106463 30.6388047" :style="polygonStyle"></polygon>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
  export default {
    name: 'PlaySvg',
    props: {
      fill: {
        type: String,
        default: 'white'
      }
    },
    computed: {
      polygonStyle () {
        return {
          fill: this.fill
        }
      }
    }
  }
</script>

<style>
  .play-svg {
    height: 100%;
    width: auto;
  }
</style>
