
export const releaseFilterParams = function(params, route) {
  let releaseFilterParams = {}
  if (route && route.name === 'metagenres-slug') {
    releaseFilterParams['metagenres'] = [params.slug]
  } else if (params.subslug) {
    releaseFilterParams['subgenres'] = [params.subslug]
  } else if (params.slug) {
    releaseFilterParams['genres'] = [params.slug]
  }
  return releaseFilterParams
}

export const getFilterByGenreParams = function(route){
  const params = route.params || {}
  let options = {
    slug: params.subslug || params.slug,
    isSubgenre: typeof params.subslug !== 'undefined'
  }
  options.meta = route.name === 'metagenres-slug'
  return options
}
