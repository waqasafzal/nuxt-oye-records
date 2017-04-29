<template>
    <script type="application/ld+json">
      {{ productSchema }}
    </script>
</template>

<script>
  export default {
    name: 'JsonLdProductSchema',
    props: ['release'],
    data: function () {
      return {
        releaseUrl: this.$router.resolve({
          name: 'release-id-slug',
          params: {id: this.release.pk, slug: this.release.slug}}).href
      }
    },
    computed: {
      productSchema () {
        return JSON.stringify({
          '@context': 'http://schema.org/',
          '@type': 'MusicAlbum',
          'name': this.release.title,
          'description': this.release.artistFirstName + ' ' + this.release.artistLastName,
          'url': this.releaseUrl,
          'image': this.release.thumbnailUrl,
          'potentialAction': {
            '@type': 'ListenAction',
            'target': [
              {
                '@type': 'EntryPoint',
                'urlTemplate': this.releaseUrl + '?autoplay=true',
                'actionPlatform': [
                  'http://schema.org/DesktopWebPlatform',
                  'http://schema.org/IOSPlatform',
                  'http://schema.org/AndroidPlatform'
                ],
                'InLanguage': 'English'
              }
            ],
            'expectsAcceptanceOf': {
              '@type': 'Offer',
              'priceCurrency': this.release.price.currency,
              'price': this.release.price.gross,
              'eligibleRegion': [
                {
                  '@type': 'Country',
                  'name': 'DE'
                },
                {
                  '@type': 'Country',
                  'name': 'AT'
                },
                {
                  '@type': 'Country',
                  'name': 'CH'
                },
                {
                  '@type': 'Country',
                  'name': 'FR'
                },
                {
                  '@type': 'Country',
                  'name': 'GB'
                }
              ]
            }
          }
        })
      }
    }
  }
</script>
