export const availabilitySchema = (release) => {
  switch(release.availability.status) {
    case 'available':
      return "https://schema.org/InStock"
    case 'few':
      return "https://schema.org/LimitedAvailability"
    case 'one':
      return "https://schema.org/LimitedAvailability"
    case 'upcoming':
      return "https://schema.org/PreOrder"
    case 'out':
      return "https://schema.org/OutOfStock"
    default:
      return "https://schema.org/InStock"
  }
}

export const getReleaseUrl = (router, release) => {
  return __API__ + router.resolve({
    name: 'releases-slug',
    params: { slug: release.slug }
  }).href
}

export const getReleaseProduct = (release, router, options = {}) => {
  const url = getReleaseUrl(router, release)
  const offers = {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    availability: availabilitySchema(release),
    price: release.price.gross,
    url
  }
  if (options.withPlace) {
    offers.availableAtOrFrom = {
      '@context': 'http://schema.org/',
        '@type': 'Place',
        'name': 'OYE Records',
        'address': {
        '@type': 'PostalAddress',
          'addressLocality': 'Berlin',
          'addressCountry': 'Germany',
          'postalCode': '10435',
          'streetAddress': 'Oderberger Str. 4',
          'telephone': '0049 30 66647821',
          'url': 'https://oye-records.com'
      }
    }
  }
  const schemaObject = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    name: `${release.name} - ${release.title} (${release.format})`,
    image: __API__ + release.thumbnailUrl,
    brand: release.label,
    url,
    offers
  }
  if (release.description) {
    schemaObject.description = release.description
  }
  return schemaObject
}

export const getItemList = (releases, context) => {
  return {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    url: __API__ + context.$route.path,
    numberOfItems: releases.length,
    itemListElement: releases.map((x,i) => {
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: getReleaseProduct (x, context.$router)
      }
    })
  }
}