import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { GET_ALL_NOTES, GET_ALL_POSTS_BY_TOPIC, GET_TOPIC_BY_TITLE,  } from '../../graphql/queries';
import Post from '../../components/Post';
import PostBox from '../../components/PostBox';
import { useForm } from 'react-hook-form';
import { ADD_NOTES } from '../../graphql/mutations';
import client from '../../apollo-client';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import HelpcatPageLoader from '../../components/HelpcatPageLoader';
import helpcat from '../../assets/helpcat.jpeg';
import Image from 'next/image';
import { TbEdit } from 'react-icons/tb';
import supabase from '../../supabaseClient';
import HelpcatError from '../../components/HelpcatError';
import Login from '../../components/Login';

type FormData = {
    note: string;
    link: string;
    image: string;
};

const title = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [edit, setEdit] = useState(false);

    const { 
        query: { title }, 
    } = useRouter();

    const { data: session } = useSession();
    const [addNote] = useMutation(ADD_NOTES, {
        refetchQueries: [GET_ALL_NOTES, 'getNotesList'],
    });

    const queryMultiple = () => {
        const res1 = useQuery(GET_ALL_POSTS_BY_TOPIC, {
            variables: {
                title: title,
            },
        });
        const res2 = useQuery(GET_ALL_NOTES, {
            variables: {
                title: title,
            }
        });

        return [res1, res2];
    };

    const [ 
        { data: data1, error: error1 },
        { data: data2, error: error2 },
    ] = queryMultiple();

    const posts: Post[] = data1?.getPostListByTopic;
    const notes: Notes[] = data2?.getNotesList;

    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>();

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);

        try {
            const {
                data: { getTopicListByTitle },
            } = await client.query({
                query: GET_TOPIC_BY_TITLE,
                variables: {
                    title: title 
                },
            });

            const note = formData.note || 'Link:';
            const link = formData.link || '';

            const {
                data: { insertNote: newNote },
            } = await addNote({
                variables: {
                    text: note,
                    topic_id: getTopicListByTitle[0].id,
                    link: link,
                    username: session?.user?.name,
                },
            });

            setValue('note', '');
            setValue('link', '');

            setLoading(false);

        } catch (errors) {
            console.log(errors);

            setLoading(false);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);

        };
    });

    const topicId = posts?.[0]?.topics?.[0]?.id;

    const toggleimageSubmitInput = () => {
        setEdit(!edit);
    };

    const submitTopicImage = handleSubmit(async (formData) => {
        const image = formData.image || '';

        try {
            const { data, error } = await supabase
            .from('topics')
            .update({ 'topic_image': image })
            .eq('id', topicId);

            setEdit(false);
            setValue('image', '');

        } catch (errors) {
            console.log(errors);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);

        };
    });

    const topicImage = posts?.[0]?.topics?.[0]?.topic_image;

    return (
        <>
            {session ? (
                <>
                    <div className='hidden lg:flex items-center justify-center my-[1rem] relative text-xs'>
                        {topicImage && (
                            <div>
                                <img 
                                    src={topicImage} 
                                    className='flex items-center justify-center rounded-[100%] w-[5rem] h-[5rem] object-cover mr-2 ' 
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = 'https://lirp.cdn-website.com/20e7d968/dms3rep/multi/opt/Redcat+app+icon-1920w.png';
                                    }}
                                />
                            </div>
                        )}

                        <h1 className='uppercase font-sans text-xl  mr-2'>Welcome To Everything About {title}</h1>

                        <TbEdit className='cursor-pointer mr-2 text-sm text-upvote/90' onClick={toggleimageSubmitInput} />

                        {edit && (
                            <form onSubmit={submitTopicImage} className=''>
                                <input 
                                    type='text' 
                                    className='absolute placeholder-white/80 dark:placeholder-white/80 w-[15rem] outline-none bg-bgPurple dark:bg-black'
                                    placeholder='[UPDATE IMAGE]' 
                                    {...register('image')}
                                    disabled={!session}
                                    autoComplete='off'
                                    spellCheck='false' 
                                />

                                <button type='submit'></button>
                            </form>
                        )}

                    </div>

                    <div className='flex justify-between'>

                        <div className='flex-1'>
                            {posts?.map((post) => (
                                <Post key={post.id} post={post} />
                            ))}
                        </div>

                        <div className='flex justify-center mx-[2rem]'>
                            <div className='flex flex-col rounded-md w-[100%] mt-[1rem] sticky self-start top-[9.5rem] dark:text-white/70 text-white/70'>
                                <PostBox />

                                <h1 className='text-center mb-[1rem]'>Notes & Useful Links</h1>

                                {
                                    loading ? (
                                        <div className='flex flex-col items-center justify-center mt-[1rem] mb-[2rem]'>
                                            <HelpcatLoadingAnimation>
                                                <Image 
                                                    className='m-auto rounded-full'
                                                    src={helpcat} 
                                                    width={50}
                                                    height={50}
                                                />
                                            </HelpcatLoadingAnimation>

                                            <div>
                                                <p className='mt-[1rem] text-xs'>
                                                    H<E>E</E>LPCAT I<S>S</S> UPD<A>A</A>TI<N>N</N>G T<H>H</H>E <D>D</D>ATA<B>B</B>ASE..
                                                </p>
                                            </div>

                                        </div>
                                    ) : (
                                        <form onSubmit={onSubmit}>
                                            <input 
                                                {...register('note')}
                                                disabled={!session}
                                                type='text' 
                                                autoComplete='off'
                                                className='placeholder-white/80 dark:placeholder-white/80 w-[100%] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-xs border-b'
                                                placeholder='[ADD NOTE]'
                                            />
                
                                            <input 
                                                {...register('link')}
                                                disabled={!session}
                                                type='text' 
                                                autoComplete='off'
                                                className='placeholder-white/80 dark:placeholder-white/80 w-[100%] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-xs border-b'
                                                placeholder='[ADD LINK]'
                                            />
                
                                            <button type='submit'></button>
                
                                        </form>
                                    )
                                }

                                <div className='dark:bg-bgBlue/20 bg-darkPurple rounded-md'>
                                    <NoteContainer className='p-[1rem] flex flex-col overflow-auto 2xl:h-[30rem] 2xl:w-[25rem] lg:w-[20rem] lg:h-[20rem]'>

                                        <h1 className='text-center my-[1rem]'>NOTES</h1>

                                        {notes?.map((note) => (
                                            <div key={note.id}
                                            className='p-2 mb-[1rem] bg-bgPurple/60 dark:bg-black/60 rounded-md text-xs hover:shadow-lg hover:shadow-bgBlue/80 dark:shadow-darkPurple/40 cursor-pointer transform transition duration-500 hover:scale-[1.01]'
                                            >
                                                <p className='font-light mb-1 text-ellipsis overflow-hidden ...'>
                                                    # {note.text}
                                                </p>

                                                <a 
                                                    href={note.link} 
                                                    target='_blank'
                                                    className='hover:text-white/90'
                                                >
                                                    <p className='font-light underline mb-2 text-ellipsis overflow-hidden ...'>{note.link}</p>
                                                </a>

                                                <p className='text-[0.6rem]'>
                                                    - {note.username}
                                                </p>

                                            </div>
                                        ))}

                                    </NoteContainer>

                                </div>
                            </div>
                        </div>
                    </div>

                    {!posts && (
                        <HelpcatPageLoader />
                    )}

                    {error && (
                        <HelpcatError />
                    )}
                </>
            ) : (
                <div className='flex justify-center'>
                    <Login />
                </div>
            )}

        </>
    );
};

export default title;

// stylesheet

const NoteContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`

const HelpcatLoadingAnimation = styled.div`
    animation: bounce2 2s ease infinite;

    @keyframes bounce2 {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-30px);}
        60% {transform: translateY(-15px);}
    }
`

const E = styled.span`
    animation: e 1.5s linear infinite;

    @keyframes e {
        100% {
            color: #9141e6
        }
    }
`

const S = styled.span`
    animation: s 3s linear infinite;

    @keyframes s {
        100% {
            color: #cae3dd
        }
    }
`

const A = styled.span`
    animation: a 2.5s linear infinite;

    @keyframes a {
        100% {
            color: #5382d2
        }
    }
`

const H = styled.span`
    animation: h 3.5s linear infinite;

    @keyframes h {
        100% {
            color: #80eaac
        }
    }
`

const B = styled.span`
    animation: b 2s ease-in-out infinite;

    @keyframes b {
        100% {
            color: #72e6e8
        }
    }
`

const N = styled.span`
    animation: n 1.5s linear infinite;

    @keyframes n {
        100% {
            color: #d588d5
        }
    }
`

const D = styled.span`
    animation: d 1.75s ease-in-out infinite;

    @keyframes d {
        100% {
            color: #af8be9
        }
    }
`