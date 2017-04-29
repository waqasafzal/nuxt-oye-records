
import gql from 'graphql-tag'

export const mainGenres = gql`
    fragment MainGenres on MetaGenreType {
        name
        slug
        genres {
            pk
            slug
            name
            subgenres {
                pk
                name
                slug
            }
        }
    }
`
