/**
 * Created by tillkolter on 01/05/17.
 */
import gql from 'graphql-tag'
import { mainGenres } from '../graphql/genres'
import { release } from '../graphql/releases'

export const createMainGenresQuery = function (first) {
  return {
    query: gql`query MainGenres($limit: Int) {
        metaGenres {
            ...MainGenres
            releases(limit: $limit) {
                ...Release
            }
        }
    }
    ${mainGenres}
    ${release}
    `,
    variables: {
      first: first
    }
  }
}

export const createGenreQuery = function (params) {
  return {
    query: gql`query Genre($slug: ID!, $sub: Boolean, $meta: Boolean) {
        detailGenre: genre(slug: $slug, sub: $sub, meta: $meta) {
            pk
            name
            slug
            subgenres {
                parentGenre {
                    slug
                }
                pk
                name
                slug
            }
        }
    }`,
    variables: {
      slug: params.slug,
      sub: params.isSubgenre || false,
      meta: params.meta || false
    }
  }
}
