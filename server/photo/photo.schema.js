import gql from 'graphql-tag'

export const photoType = gql`
    type Photo {
        id: ID!
        format: String!
        width: Int
        height: Int
        filename: String!
        author: String
        author_url : String
        post_url: String
    }
`

export const photoQuery = gql`
    type Query {
        list: [Photo]
    }
`

export const photoMutation = gql`
    type Mutation {
        add(format: String!): Photo
    }
`