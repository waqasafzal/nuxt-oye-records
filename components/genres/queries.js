/**
 * Created by tillkolter on 01/05/17.
 */
import gql from 'graphql-tag'
import { mainGenres } from '../graphql/genres'

export const createMainGenresQuery = function () {
  return {
    query: gql`query MainGenres {
        metaGenres {
            ...MainGenres
        }
    }
    ${mainGenres}
    `
  }
}

export const createGenreQuery = function (params) {
  return {
    query: gql`query Genre($slug: ID!, $sub: Boolean) {
        detailGenre: genre(slug: $slug, sub: $sub) {
            pk
            name
            slug
            subgenres {
                pk
                name
                slug
            }
        }
    }`,
    variables: {
      slug: params.slug,
      sub: params.isSubgenre || false
    }
  }
}
