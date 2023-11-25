import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { useSession } from 'next-auth/react'; 
import { TbArrowNarrowDown, TbArrowNarrowRight, TbArrowNarrowUp, TbPhoto } from 'react-icons/tb';
import { IoMdShare, IoMdCopy } from 'react-icons/io';
import { BiMessageDetail } from 'react-icons/bi';
import TimeAgo from 'react-timeago';
import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries';
import { ADD_VOTE } from '../graphql/mutations';
import HelpcatError from './HelpcatError';

type Props = {
    post: Post;
};

const Post = ({ post }: Props) => {
    const [vote, setVote] = useState<boolean>();
    const [toggleUpvote, setToggleUpvote] = useState(false);
    const [toggleDownvote, setToggleDownvote] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const { data: session } = useSession();

    const { data, error: error1 } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
        variables: {
            post_id: post?.id,
        },
    });

    const votes: Votes[] = data?.getVotesByPostId;

    useEffect(() => {
        const votes: Votes[] = data?.getVotesByPostId;

        const vote = votes?.find(
            (vote) => vote.username == session?.user?.name
        )?.upvote;

        setVote(vote);
    }, [data]);

    const [addVote] = useMutation(ADD_VOTE, {
        refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesByPostId'],
    });

    const upVote = async (isUpvote: boolean) => {
        if (vote && isUpvote) return;
        if (vote === false && !isUpvote) return;

        try {
            await addVote({
                variables: {
                    post_id: post.id,
                    username: session?.user?.name,
                    upvote: isUpvote,
                },
            });

        } catch (errors) {
            console.log(errors);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);
    
        };
    };

    const displayVotes = (votes: Votes[]) => {
        const displayNumber = votes?.reduce(
            (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)), 0
        );

        if (votes?.length === 0) return 0;

        if (displayNumber === 0) {
            return votes[0]?.upvote ? 1 : -1;
        }

        return displayNumber;
    };

    const images = post.images.filter(image => image.url !== '');

    return (
        <>
            <div className='hidden hover:shadow-lg hover:shadow-bgBlue/80 dark:shadow-darkPurple/40 cursor-pointer transform transition duration-500 hover:scale-[1.01] lg:flex justify-between font-sans mb-[2rem] h-[40rem] bg-darkPurple dark:bg-bgBlue/20 ml-[2rem] mt-[1rem] p-[2rem] rounded-md'>
                <div className={`flex flex-col ${post.images[0]?.url === '' ? '2xl:w-[100%] lg:w-[100%]' : '2xl:w-[25rem] lg:w-[21rem] mr-6'}`}>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center mb-[1rem]'>
                            <img 
                                src={post.user_image} 
                                referrerPolicy='no-referrer' 
                                className='rounded-full mr-2' 
                                width={30} 
                                height={30} 
                            />

                            <p className=' text-xs font-normal text-lightBlue dark:text-white'>
                                <Link href={`/topic/${post.topics[0]?.title}`}>
                                    <span className='dark:text-neonBlueGreen uppercase cursor-pointer text-darkBlue font-medium'>{post.topics[0]?.title}</span>
                                </Link> • {post.username} posted <TimeAgo date={post.post_created_at} /> 
                            </p>
                
                        </div>

                    </div>

                    <div className='text-center mb-[2rem] uppercase'>
                        <h2>
                            <span className='text-pastelPink dark:text-white'>{post.post_title}</span>
                        </h2>
                    </div>

                    <PostBodyContainer className='flex flex-col h-[35rem] overflow-auto text-sm'>
                        {parse(post.body)}
                    </PostBodyContainer>

                    <div className='flex items-center  mt-[2rem] space-x-10'>
                        <Link href={`/post/${post.id}`}>
                            <div className='flex items-center hover:bg-black dark:hover:bg-white/10 hover:text-white p-1 rounded-md cursor-pointer'>
                                <BiMessageDetail className=' dark:text-neonBlueGreen text-darkBlue text-sm' />

                                <p className='text-xs ml-1 font-light'>{post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}</p>

                            </div>
                        </Link>

                        <Link href={`/post/${post.id}`}>
                            <div className='flex items-center hover:bg-black dark:hover:bg-white/10 hover:text-white p-1 rounded-md cursor-pointer'>
                                <TbPhoto className='dark:text-neonBlueGreen text-darkBlue text-sm' />

                                <p className='text-xs ml-1 font-light'>{images.length} {images.length === 1 ? 'Image' : 'Images'}</p>

                            </div>
                        </Link>

                        <div 
                            className={`flex items-center cursor-pointer  p-1 rounded-md ${copied ? '' : 'hover:bg-black dark:hover:bg-white/10 hover:text-white'}`}
                            onClick={() =>  {
                                navigator.clipboard.writeText(`https://helpcat.io/post/${post.id}`);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        >
                            <IoMdShare className='dark:text-neonBlueGreen text-darkBlue text-sm' />

                            <p className='text-xs ml-1 font-light'>Share</p>

                            {copied && (
                                <IoMdCopy className='text-xs flex relative ml-1' />
                            )}

                        </div>

                    </div>

                    <div className='mt-[1rem] flex items-center'>
                        <TbArrowNarrowRight />

                        <Link href={`/post/${post.id}`}>
                            
                            <p className='w-fit hover:underline p-1 cursor-pointer rounded-lg text-xs'>Go To Post</p>
                        </Link>
                    </div>

                </div>

                {images && (
                    <div className='flex flex-1 p-[1rem] justify-center'>
                        <img 
                            src={images[0]?.url} 
                            className='object-contain'  
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = 'https://i.pcmag.com/imagery/reviews/04C2m2ye5UfXyb5x5WWIsZ4-19..v1625759628.png';
                            }}
                        />
                    </div>
                )}

                {session ? (
                    <div className='flex flex-col items-center'>

                        <div onClick={(() => { setToggleUpvote(true); setToggleDownvote(false); })}>
                            {toggleUpvote ? (
                                <TbArrowNarrowUp 
                                    className={`cursor-pointer rounded-md hover:bg-black dark:hover:bg-white/10 hover:text-white dark:hover:text-upvote ${vote && 'text-upvote'}`} 
                                />
                            ) : (
                                <TbArrowNarrowUp 
                                    onClick={(() => upVote(true))}
                                    className={`cursor-pointer rounded-md hover:bg-black dark:hover:bg-white/10 hover:text-white dark:hover:text-upvote ${vote && 'text-upvote'}`} 
                                />
                            )}

                        </div>

                        <p className='text-sm text-pastelPink dark:text-neonBlueGreen'>{displayVotes(votes)}</p>

                        <div onClick={(() => { setToggleDownvote(true); setToggleUpvote(false); })}>
                            {toggleDownvote ? (
                                <TbArrowNarrowDown 
                                    className={`cursor-pointer rounded-md hover:bg-black dark:hover:bg-white/10 hover:text-white dark:hover:text-downvote ${vote === false && 'text-downvote'}`} 
                                />
                            ) : (
                                <TbArrowNarrowDown 
                                    onClick={(() => upVote(false))}
                                    className={`cursor-pointer rounded-md hover:bg-black dark:hover:bg-white/10 hover:text-white dark:hover:text-downvote ${vote === false && 'text-downvote'}`} 
                                />
                            )}

                        </div>

                    </div>
                ) : (
                    <div className='flex flex-col items-center'>
                        <TbArrowNarrowUp className='text-black/40 dark:text-white/50' />

                        <p className='text-sm text-darkBlue dark:text-neonBlueGreen'>{displayVotes(votes)}</p>
                        
                        <TbArrowNarrowDown className='text-black/40 dark:text-white/50' />
                    </div>
                )}

                {error && (
                    <HelpcatError />
                )}

            </div>
        </>

    );
};

export default Post;

//stylesheet

const PostBodyContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`
