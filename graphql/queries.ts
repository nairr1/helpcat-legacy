import { gql } from '@apollo/client';

export const GET_TOPIC_BY_TITLE = gql`
    query MyQuery($title: String!) {
        getTopicListByTitle(title: $title) {
            id
            title
            created_at
            topic_image
        }
    }
`

export const GET_POST_BY_TITLE = gql`
    query MyQuery($post_title: String!) {
        getPostListByTitle(post_title: $post_title) {
            id
        }
    }
`

export const GET_TOPIC_LIST = gql`
    query MyQuery {
        getTopicList {
            id
            title
        }
    }
`

export const GET_STATUS = gql`
    query MyQuery {
        getStatus {
            store_id
            brand
            last_online
        }
    }
`

export const GET_ALL_NOTES = gql`
    query MyQuery($title: String!) {
        getNotesList(title: $title) {
            created_at
            id
            text
            topic_id
            link
            username
        }
    }
`

export const GET_ALL_VOTES_BY_POST_ID = gql`
    query MyQuery($post_id: ID!) {
        getVotesByPostId(post_id: $post_id) {
            id
            created_at
            post_id
            username
            upvote
        }
    }
`

export const GET_ALL_COMMENTS_BY_POST_ID = gql`
    query MyQuery($post_id: ID!) {
        getCommentsByPostId(post_id: $post_id) {
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

export const GET_ALL_NOTICES = gql`
    query MyQuery {
        getNoticePosts {
            body
            post_created_at
            id
            post_title
            username
            user_email
            user_image
            topic_id
            active
            comments {
                created_at
                id
                post_id
                text
                username
                user_email
                user_image
                comment_image
            }
            topics {
                id
                created_at
                title
                topic_image
            }
            votes {
                id
                created_at
                username
                post_id
                upvote
            }
            images {
                id
                post_id
                created_at
                url
            }
        }
    }
`

export const GET_ALL_POSTS = gql`
    query MyQuery {
        getPostList {
            body
            post_created_at
            id
            post_title
            username
            user_email
            user_image
            topic_id
            active
            comments {
                created_at
                id
                post_id
                text
                username
                user_email
                user_image
                comment_image
            }
            topics {
                id
                created_at
                title
                topic_image
            }
            votes {
                id
                created_at
                username
                post_id
                upvote
            }
            images {
                id
                post_id
                created_at
                url
            }
        }
    }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
    query MyQuery($title: String!) {
        getPostListByTopic(title: $title) {
            body
            post_created_at
            id
            post_title
            username
            user_email
            user_image
            topic_id
            active
            comments {
                created_at
                id
                post_id
                text
                username
                user_email
                user_image
                comment_image
            }
            topics {
                id
                created_at
                title
                topic_image
            }
            votes {
                id
                created_at
                username
                post_id
                upvote
            }
            images {
                id
                post_id
                created_at
                url
            }
        }
    }
`

export const GET_POST_BY_POST_ID = gql`
    query MyQuery($post_id: ID!) {
        getPostListByPostId(post_id: $post_id) {
            body
            post_created_at
            id
            post_title
            username
            user_email
            user_image
            topic_id
            active
            comments {
                created_at
                id
                post_id
                text
                username
                user_email
                user_image
                comment_image
            }
            topics {
                id
                created_at
                title
                topic_image
            }
            votes {
                id
                created_at
                username
                post_id
                upvote
            }
            images {
                id
                post_id
                created_at
                url
            }
        }
    }
`

export const GET_ALL_POST_TITLES = gql`
    query MyQuery {
        getPostTitles {
            post_title
            id
        }
    }
`

export const GET_VOTES_BY_POST_ID = gql`
    query MyQuery($post_id: ID!) {
        getVotesByPostId(post_id: $post_id) {
            votes {
                id
                created_at
                username
                post_id
                upvote
            }
        }
    }
`