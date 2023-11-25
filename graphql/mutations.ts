import { gql } from '@apollo/client';

export const ADD_POST = gql`
    mutation MyMutation(
        $body: String!
        $topic_id: ID!
        $post_title: String!
        $user_email: String!
        $user_image: String!
        $username: String!
        $active: Int!
    ) {
        insertPost(
            body: $body
            topic_id: $topic_id
            post_title: $post_title
            user_email: $user_email
            user_image: $user_image
            username: $username
            active: $active
        ) {
            body
            post_created_at
            id 
            topic_id
            post_title
            user_email
            user_image
            username
            active
        }
    }
`

export const ADD_COMMENT = gql`
    mutation MyMutation($post_id: ID!, $username: String!, $text: String!, $user_email: String!, $user_image: String!, $comment_image: String!) {
        insertComment(post_id: $post_id, username: $username, text: $text, user_email: $user_email, user_image: $user_image, comment_image: $comment_image) {
            created_at
            id
            post_id
            text
            username
            user_email
            user_image
            comment_image
        }
    }
`

export const ADD_STATUS = gql`
    mutation MyMutation($store_id: Int!, $brand: String!, $last_online: String!) {
        insertStatus(store_id: $store_id, brand: $brand, last_online: $last_online) {
            id
            created_at
            store_id
            brand
            last_online
        }
    }
`

export const ADD_IMAGES = gql`
    mutation MyMutation($post_id: ID!, $url: String!) {
        insertImage(post_id: $post_id, url: $url) {
            created_at
            id
            post_id
            url
        }
    }
`

export const ADD_VOTE = gql`
    mutation MyMutation($post_id: ID!, $username: String!, $upvote: Boolean!) {
        insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
            id
            created_at
            post_id
            username
            upvote
        }
    }
`

export const ADD_TOPIC = gql`
    mutation MyMutation($title: String!) {
        insertTopic(title: $title) {
            id
            title
            created_at
            topic_image
        }
    }
`

export const ADD_NOTES = gql`
    mutation MyMutation(
        $text: String!
        $topic_id: ID!
        $link: String!
        $username: String!
    ) {
        insertNote(
            text: $text
            topic_id: $topic_id
            link: $link
            username: $username
        ) {
            text
            topic_id
            link
            username
        }
    }
`

export const DELETE_COMMENT = gql`
    mutation MyMutation(
        $id: ID!
    ) {
        deleteComment(
            id: $id
        ) {
            id
            created_at
            post_id
            text
            username
            user_email
            user_image
            comment_image
        }
    }
`