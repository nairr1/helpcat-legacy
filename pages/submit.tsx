import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { 
    TbBold,
    TbColorPicker,
    TbItalic,
    TbMinus,
    TbUnderline,
} from 'react-icons/tb';
import {
    CgUndo,
    CgRedo,
} from 'react-icons/cg';
import { useMutation } from '@apollo/client';
import { ADD_IMAGES, ADD_POST, ADD_TOPIC } from '../graphql/mutations';
import client from '../apollo-client';
import { GET_POST_BY_TITLE, GET_TOPIC_BY_TITLE } from '../graphql/queries';
import HelpcatLoading from '../components/HelpcatLoading';
import HelpcatSubmitted from '../components/HelpcatSubmitted';
import HelpcatError from '../components/HelpcatError';
import Router from 'next/router';
import Login from '../components/Login';
import styled from 'styled-components';

type FormData = {
    postTitle: string;
    imageOne: string;
    imageTwo: string;
    imageThree: string;
    imageFour: string;
    imageFive: string;
    topic: string;
};

const submit = () => {
    const { data: session } = useSession();
    const [addPost] = useMutation(ADD_POST);
    const [addTopic] = useMutation(ADD_TOPIC);
    const [addImages] = useMutation(ADD_IMAGES);


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [submitPost, setSubmitPost] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const editor = useEditor({
        extensions: [Underline, Highlight.configure({ multicolor: true }), StarterKit],
        editorProps: {
            attributes: {
              class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none text-sm font-light',
            },
          },
        content: `
            <p>Here you can <u><strong><em>format</em></strong></u> the post's body content, <mark data-color="#d1c7fb" style="background-color: #d1c7fb">it will display as such on the UI</mark>.</p>
            <p></p>
            <p>Posting to 'notices' will post to the notice board</p>
            <p></p>
            <p>Pressing 'enter' will format text onto the next line.</p>
            <p></p>
            <p>Continuing on the same line will reflect as such on the UI and the text editor here will expand to accommodate.</p>
            <p></p>
            <p>You can make any character <strong>bold</strong>, <em>italic</em> &amp; <u>underline</u>.</p>
            <p></p>
            <p>You can insert a <em>line</em> <strong>break</strong>.</p>
            <p></p>
            <hr>
            <p></p>
            <p>And you can <mark data-color="#f3718b" style="background-color: #f3718b">highlight</mark> too!</p>
            <p></p>
            <p>Now enjoy removing this pre-filled text. :)</p>
      `,
    });

    if (!editor) {
        return null;
    };

    const htmlBody = String(editor?.getHTML()).replaceAll('<p></p>', '<br/>');

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);

        try {
            const { 
                data: { getTopicListByTitle }, 
            } = await client.query({
                query: GET_TOPIC_BY_TITLE,
                variables: {
                    title: formData.topic.trim().toLowerCase(),
                },
            });

            const topicExists = getTopicListByTitle.length > 0;

            if (!topicExists) {
                const { 
                    data: { insertTopic: newTopic }, 
                } = await addTopic({
                    variables: {
                        title: formData.topic.trim().toLowerCase(),
                    },
                });

                const { 
                    data: { insertPost: newPost }, 
                } = await addPost({
                    variables: {
                        body: htmlBody,
                        topic_id: newTopic.id,
                        post_title: formData.postTitle.trim(),
                        user_email: session?.user?.email,
                        user_image: session?.user?.image,
                        username: session?.user?.name,
                        active: 1,
                    },
                });

                const imageOne = formData.imageOne || '';
                const imageTwo = formData.imageTwo || '';
                const imageThree = formData.imageThree || '';
                const imageFour = formData.imageFour || '';
                const imageFive = formData.imageFive || '';

                const {
                    data: { insertImage: insertImageOne },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageOne.trim(),
                    },
                });

                const {
                    data: { insertImage: insertImageTwo },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageTwo.trim(),
                    },
                });

                const {
                    data: { insertImage: insertImageThree },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageThree.trim(),
                    },
                });

                const {
                    data: { insertImage: insertImageFour },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageFour.trim(),
                    },
                });

                const {
                    data: { insertImage: insertImageFive },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageFive.trim(),
                    },
                });

                setSubmitPost(true);

            } else {

                const { 
                    data: { insertPost: newPost }, 
                } = await addPost({
                    variables: {
                        body: htmlBody,
                        topic_id: getTopicListByTitle[0].id,
                        post_title: formData.postTitle.trim(),
                        user_email: session?.user?.email,
                        user_image: session?.user?.image,
                        username: session?.user?.name,
                        active: 1,
                    },
                });

                const imageOne = formData.imageOne || '';
                const imageTwo = formData.imageTwo || '';
                const imageThree = formData.imageThree || '';
                const imageFour = formData.imageFour || '';
                const imageFive = formData.imageFive || '';

                const {
                    data: { insertImage: insertImageOne },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageOne,
                    },
                });

                const {
                    data: { insertImage: insertImageTwo },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageTwo,
                    },
                });

                const {
                    data: { insertImage: insertImageThree },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageThree,
                    },
                });

                const {
                    data: { insertImage: insertImageFour },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageFour,
                    },
                });

                const {
                    data: { insertImage: insertImageFive },
                } = await addImages({
                    variables: {
                        post_id: newPost.id,
                        url: imageFive,
                    },
                });

                setSubmitPost(true);

            };

            setValue('imageOne', '');
            setValue('imageTwo', '');
            setValue('imageThree', '');
            setValue('imageFour', '');
            setValue('imageFive', '');
            setValue('postTitle', '');
            setValue('topic', '');

            setLoading(false);

            editor.commands.setContent(`
                <p>Here you can <u><strong><em>format</em></strong></u> the post's body content, <mark data-color="#d1c7fb" style="background-color: #d1c7fb">it will display as such on the UI</mark>.</p>
                <p></p>
                <p>Posting to 'notices' will post to the notice board</p>
                <p></p>
                <p>Pressing 'enter' will format text onto the next line.</p>
                <p></p>
                <p>Continuing on the same line will reflect as such on the UI and the text editor here will expand to accommodate.</p>
                <p></p>
                <p>You can make any character <strong>bold</strong>, <em>italic</em> &amp; <u>underline</u>.</p>
                <p></p>
                <p>You can insert a <em>line</em> <strong>break</strong>.</p>
                <p></p>
                <hr>
                <p></p>
                <p>And you can <mark data-color="#f3718b" style="background-color: #f3718b">highlight</mark> too!</p>
                <p></p>
                <p>Now enjoy removing this pre-filled text. :)</p>
            `);

            setTimeout(() => {
                setSubmitPost(false);
                Router.push('/');
            }, 2000);

            setTimeout(() => {
                Router.reload();
            }, 2001);

        } catch (error) {
            console.log(error);

            setLoading(false);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 2000);

        };
    });

    return (
        <>
            {session ? (
                <form onSubmit={onSubmit}>
                    <div className='font-sans hidden lg:flex flex-col items-center justify-center mt-[2rem] mb-[2rem]'>
                        <p className='mb-[2rem] text-lg dark:bg-bgPurple bg-pastelPink/10'>
                            CREATE A NEW POST
                        </p>
        
                        <div className='flex flex-col'>
                            <input 
                                {...register('postTitle', { required: true })}
                                type='text' 
                                autoComplete='off'
                                className='placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                disabled={!session}
                                placeholder={session ? '[TITLE]' : '[LOGIN TO POST]'}
                            />
        
                            <input 
                                {...register('topic', { required: true })}
                                type='text' 
                                autoComplete='off'
                                className='placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                disabled={!session}
                                placeholder={session ? '[TOPIC]' : '- - -'}
                            />
        
                            <input 
                                {...register('imageOne')}
                                type='text' 
                                autoComplete='off'
                                className='placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                disabled={!session}
                                placeholder={session ? '[IMAGE URL]' : '- - -'}
                            />
        
                            {!!watch('imageOne') && (
                                <input 
                                    {...register('imageTwo')}
                                    type='text' 
                                    autoComplete='off'
                                    className='placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                    disabled={!session}
                                    placeholder={session ? '[IMAGE URL]' : '- - -'}
                                />
                            )}
        
                            {!!watch('imageTwo') && (
                                <input 
                                    {...register('imageThree')}
                                    type='text' 
                                    autoComplete='off'
                                    className='placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                    disabled={!session}
                                    placeholder={session ? '[IMAGE URL]' : '- - -'}
                                />
                            )}
        
                            {!!watch('imageThree') && (
                                <input 
                                    {...register('imageFour')}
                                    type='text' 
                                    autoComplete='off'
                                    className='placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                    disabled={!session}
                                    placeholder={session ? '[IMAGE URL]' : '- - -'}
                                />
                            )}
        
                            {!!watch('imageFour') && (
                                <input 
                                    {...register('imageFive')}
                                    type='text' 
                                    autoComplete='off'
                                    className='placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                    disabled={!session}
                                    placeholder={session ? '[IMAGE URL]' : '- - -'}
                                />
                            )}
        
                        </div>
        
                        <div className='space-x-10 mt-[1rem]'>
                            <button
                                onClick={(e) => { 
                                    editor.chain().focus().toggleBold().run(); 
                                    e.preventDefault(); 
                                }}
                                disabled={
                                !editor.can()
                                    .chain()
                                    .focus()
                                    .toggleBold()
                                    .run()  
                                }
                                className={editor.isActive('bold') ? 'dark:text-pastelPink text-neonBlueGreen' : ''}
                            >
                                <TbBold />
                            </button>
        
                            <button
                                onClick={(e) => { 
                                    editor.chain().focus().toggleItalic().run(); 
                                    e.preventDefault(); 
                                }}
                                disabled={
                                !editor.can()
                                    .chain()
                                    .focus()
                                    .toggleItalic()
                                    .run()
                                }
                                className={editor.isActive('italic') ? 'dark:text-pastelPink text-neonBlueGreen' : ''}
                            >
                                <TbItalic />
                            </button>
        
                            <button
                                onClick={(e) => {
                                    editor.chain().focus().toggleUnderline().run(); 
                                    e.preventDefault();
                                }}
                                disabled={
                                !editor.can()
                                    .chain()
                                    .focus()
                                    .toggleItalic()
                                    .run()
                                }
                                className={editor.isActive('underline') ? 'dark:text-pastelPink text-neonBlueGreen' : ''}
                            >
                                <TbUnderline />
                            </button>
        
                            <button onClick={(e) => {
                                editor.chain().focus().setHorizontalRule().run();
                                e.preventDefault();
                                }}>
                                <TbMinus />
                            </button>
        
                            <button
                                onClick={(e) => {
                                    editor.chain().focus().toggleHighlight({ color: '#d1c7fb' }).run();
                                    e.preventDefault();
                                }}
                                className={editor.isActive('highlight', { color: '#d1c7fb' }) ? 'is-active text-pastelPink' : 'text-pastelPink'}
                            >
                                <TbColorPicker />
                            </button>
        
                            <button
                                onClick={(e) => {
                                    editor.chain().focus().toggleHighlight({ color: '#f3718b' }).run();
                                    e.preventDefault();
                                }}
                                className={editor.isActive('highlight') ? 'is-active text-redError/70' : 'text-redError/70'}
                            >
                                <TbColorPicker />
                            </button>
        
                            <button
                                onClick={(e) => {
                                    editor.chain().focus().undo().run();
                                    e.preventDefault();
                                }}
                                disabled={
                                !editor.can()
                                    .chain()
                                    .focus()
                                    .undo()
                                    .run()
                                }
                            >
                                <CgUndo />
                            </button>
        
                            <button
                                onClick={(e) => {
                                    editor.chain().focus().redo().run();
                                    e.preventDefault();
                                }}
                                disabled={
                                
                                !editor.can()
                                    .chain()
                                    .focus()
                                    .redo()
                                    .run()
                                }
                            >
                                <CgRedo />
                            </button>
        
                        </div>
        
                        <div>
                            <EditorContent editor={editor} />
                        </div>
        
                        <div className='mt-[3rem]'>
                            <ButtonAnimation
                                className='dark:bg-bgPurple bg-black/50 text-white px-2 py-1 rounded-md text-sm'
                                disabled={!session}
                                type='submit'
                            >
                                SUBMIT
                            </ButtonAnimation>
                        </div>
        
                        {Object.keys(errors).length > 0 && (
                            <div className='mt-[2rem] text-redError text-xs'>
                                {errors.postTitle?.type === 'required' && (
                                    <p>*** NO TITLE SUBMITTED ***</p>
                                )}
        
                                {errors.topic?.type === 'required' && (
                                    <p>*** NO TOPIC SUBMITTED ***</p>
                                )}
                            </div>
                        )}
        
                        {loading && (
                            <HelpcatLoading />
                        )}
        
                        {submitPost && (
                            <HelpcatSubmitted />
                        )}
                        
                        {error && (
                            <HelpcatError />
                        )}
                    </div>
        
                </form>
            ) : (
                <div className='flex justify-center'>
                    <Login />
                </div>
            )}
        </>
    );
};

export default submit;

const ButtonAnimation = styled.button`
    :hover {
        animation: cycle 2s ease infinite;
    }

    @keyframes shake {
        10% { transform: rotate(8deg); }
        20% { transform: rotate(-8deg); }
        30% { transform: rotate(6deg); }
        40% { transform: rotate(-6deg); }
        50% { transform: rotate(4deg); }
        60% { transform: rotate(-4deg); }
        70% { transform: rotate(2deg); }
        80% { transform: rotate(-2deg); }
        90% { transform: rotate(1deg); }
        100% { transform: initial; }
    }

    @keyframes cycle {
        0% {
            background: #ee6055;
        }
        10% { transform: rotate(1deg); }
        20% { transform: rotate(-1deg); }
        25% {
            background: #60d394;
        }
        30% { transform: rotate(2deg); }
        40% { transform: rotate(-2deg); }
        50% {
            background: #aaf683;
            transform: rotate(2deg);
        }
        60% { transform: rotate(-1deg); }
        70% { transform: rotate(1deg); }
        75% {
            background: #ffd97d;
        }
        80% { transform: rotate(-1deg); }
        90% { transform: rotate(1deg); }
        100% {
            background: #ff9b85;
            transform: initial; 
        }
    }
`