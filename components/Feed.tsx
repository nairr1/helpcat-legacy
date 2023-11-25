import { useQuery } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import { GET_ALL_NOTICES, GET_ALL_POSTS } from '../graphql/queries';
import Post from './Post';
import PostBox from './PostBox';
import parse from 'html-react-parser';
import TimeAgo from 'react-timeago';
import HelpcatPageLoader from './HelpcatPageLoader';
import Link from 'next/link';
import HelpcatError from './HelpcatError';
import { useSession } from 'next-auth/react';
import Login from '../components/Login';

const Feed = () => {
    const { data: session } = useSession();

    const queryMultiple = () => {
        const res1 = useQuery(GET_ALL_POSTS);
        const res2 = useQuery(GET_ALL_NOTICES);

        return [res1, res2];
    };

    const [
        { data: data1, error: error1 },
        { data: data2, error: error2},
    ] = queryMultiple();

    const posts: Post[] = data1?.getPostList;
    const notices: Post[] = data2?.getNoticePosts;

    return (
        <div className='flex justify-evenly'>
            {session ? (
                <>
                    <div className='flex-1'>
                        {posts?.map((post) => (
                            <Post key={post.id} post={post} />
                        ))}
                    </div>

                    <div className='hidden lg:flex justify-center mx-[2rem]'>
                        <div className='flex flex-col rounded-md w-[100%] sticky self-start top-[9.5rem] dark:text-white/70 text-white/70'>
                            <PostBox />

                            <div className='dark:bg-bgBlue/20 bg-darkPurple rounded-md'>
                                <ScrollContainer className='p-[1rem] flex flex-col overflow-auto 2xl:h-[40rem] 2xl:w-[25rem] lg:w-[20rem] lg:h-[30rem]'>

                                    <h1 className='text-center my-[1rem]'>NOTICE BOARD</h1>

                                    {notices?.map((notice) => (
                                        <Link 
                                            href={`/post/${notice.id}`} 
                                            key={notice.id}
                                        >
                                            <div className='p-2 mb-[1rem] dark:bg-black/60 bg-bgPurple/60 rounded-lg hover:shadow-md hover:shadow-bgBlue/80 dark:shadow-darkPurple/40 cursor-pointer transform transition duration-500 hover:scale-[1.01]'>
                                                <div className='text-center space-y-1 mb-5'>
                                                    <span className='bg-redError text-black font-bold text-center text-sm px-0.5'>IMPORTANT</span>

                                                    <p className='text-xs font-normal'>
                                                        {notice.username} posted <TimeAgo date={notice.post_created_at} /> 
                                                    </p>

                                                </div>

                                                <p className='font-light mb-2 text-sm capitalize px-2'>
                                                    # {notice.post_title}
                                                </p>

                                                <div className='font-light mb-4 text-xs px-2'>
                                                    {parse(notice.body)}
                                                </div>

                                            </div>
                                        </Link>
                                    ))}

                                </ScrollContainer>

                            </div>

                        </div>
                        
                    </div>

                    {!posts && (
                        <HelpcatPageLoader />
                    )}

                </>
            ): (
                <div className='hidden lg:flex justify-center'>
                    <Login />
                </div>
            )}
            
        </div>
    );
};

export default Feed;

// stylesheet

const ScrollContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`