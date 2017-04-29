<template>
  <div>
    {{ price.gross }} &euro;
  </div>
</template>

<script>

  export default {
    name: 'ReleasePrice',
    props: ['price']
  }
</script>
