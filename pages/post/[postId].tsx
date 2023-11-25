import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_COMMENTS_BY_POST_ID, GET_ALL_VOTES_BY_POST_ID, GET_POST_BY_POST_ID } from '../../graphql/queries';
import { TbArrowNarrowDown, TbArrowNarrowUp, TbPhoto } from 'react-icons/tb';
import { IoMdCopy, IoMdShare } from 'react-icons/io';
import Link from 'next/link';
import { BiMessageDetail } from 'react-icons/bi';
import parse from 'html-react-parser';
import TimeAgo from 'react-timeago';
import HelpcatPageLoader from '../../components/HelpcatPageLoader';
import { useSession } from 'next-auth/react';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { 
    TbBold,
    TbColorPicker,
    TbItalic,
    TbMinus,
    TbUnderline,
    TbEdit,
} from 'react-icons/tb';
import {
    CgUndo,
    CgRedo,
} from 'react-icons/cg';
import { MdOutlineKeyboardBackspace, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { ADD_COMMENT, ADD_VOTE, DELETE_COMMENT } from '../../graphql/mutations';
import supabase from '../../supabaseClient';
import HelpcatLoading from '../../components/HelpcatLoading';
import HelpcatError from '../../components/HelpcatError';
import Login from '../../components/Login';
import styled from 'styled-components';

const PostPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const [commentId, setCommentId] = useState(0);
    const [commentUpdate, setCommentUpdate] = useState(false);
    const [editPost, setEditPost] = useState(false);
    const [postUpdate, setPostUpdate] = useState(false);
    const [key, setKey] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_POST_BY_POST_ID, 'getPostListByPostId'],
    });

    const [deleteComment] = useMutation(DELETE_COMMENT, {
        refetchQueries: [GET_ALL_COMMENTS_BY_POST_ID, 'getCommentsByPostId'],
    });

    const [vote, setVote] = useState<boolean>();
    const [toggleUpvote, setToggleUpvote] = useState(false);
    const [toggleDownvote, setToggleDownvote] = useState(false);

    const queryMultiple = () => {
        const res1 = useQuery(GET_POST_BY_POST_ID, {
            variables: {
                post_id: router.query.postId,
            },
        });

        const post: Post = res1.data?.getPostListByPostId;

        const res2 = useQuery(GET_ALL_VOTES_BY_POST_ID, {
            variables: {
                post_id: post?.id,
            },
        });

        const res3 = useQuery(GET_ALL_COMMENTS_BY_POST_ID, {
            variables: {
                post_id: post?.id,
            },
        });

        return [res1, res2, res3];
    };

    const [
        { data: data1, error: error1 },
        { data: data2, error: error2 },
        { data: data3, error: error3 },
    ] = queryMultiple();

    const post: Post = data1?.getPostListByPostId;

    const postImageOne = post?.images[0]?.url || '';
    const postImageTwo = post?.images[1]?.url || '';
    const postImageThree = post?.images[2]?.url || '';
    const postImageFour = post?.images[3]?.url || '';
    const postImageFive = post?.images[4]?.url || '';

    const postTitle = post?.post_title || '';

    const [title, setTitle] = useState(postTitle);

    const [imageOne, setImageOne] = useState(postImageOne);
    const [imageTwo, setImageTwo] = useState(postImageTwo);
    const [imageThree, setImageThree] = useState(postImageThree);
    const [imageFour, setImageFour] = useState(postImageFour);
    const [imageFive, setImageFive] = useState(postImageFive);

    useEffect(() => {
        setImageOne(postImageOne);
    }, [postImageOne]);

    useEffect(() => {
        setImageTwo(postImageTwo);
    }, [postImageTwo]);

    useEffect(() => {
        setImageThree(postImageThree);
    }, [postImageThree]);

    useEffect(() => {
        setImageFour(postImageFour);
    }, [postImageFour]);

    useEffect(() => {
        setImageFive(postImageFive);
    }, [postImageFive]);

    useEffect(() => {
        setTitle(postTitle);
    }, [postTitle]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
    };

    const handleImageOneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageOne(event.currentTarget.value);
    };

    const handleImageTwoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageTwo(event.currentTarget.value);
    };

    const handleImageThreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageThree(event.currentTarget.value);
    };

    const handleImageFourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageFour(event.currentTarget.value);
    };

    const handleImageFiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageFive(event.currentTarget.value);
    };

    const body = post?.body || '';

    const votes: Votes[] = data2?.getVotesByPostId;

    const comments: Comments[] = data3?.getCommentsByPostId;

    const [commentImage, setCommentImage] = useState('');
    const [updateCommentImage, setUpdateCommentImage] = useState('');

    const handleCommentImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentImage(e.currentTarget.value)
    };

    useEffect(() => {
        setUpdateCommentImage(updateCommentImage);
    }, [updateCommentImage]);

    const handleUpdateCommentImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateCommentImage(e.currentTarget.value)
    };

    useEffect(() => {
        const votes: Votes[] = data2?.getVotesByPostId;

        const vote = votes?.find(
            (vote) => vote?.username == session?.user?.name
        )?.upvote;

        setVote(vote);

    }, [data2]);

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
        };

        return displayNumber;
    };

    const editor = useEditor({
        extensions: [Underline, Highlight.configure({ multicolor: true }), StarterKit, Placeholder.configure({
            placeholder: 'Share your thoughts..',
        })],
        editorProps: {
            attributes: {
              class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none text-sm font-light',
            },
          },
    });

    if (!editor) {
        return null;
    };

    const htmlBody = String(editor?.getHTML()).replaceAll('<p></p>', '<br/>');

    const submitNewComment = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            await addComment({
                variables: {
                    post_id: router.query.postId,
                    username: session?.user?.name,
                    user_email: session?.user?.email,
                    user_image: session?.user?.image,
                    text: htmlBody,
                    comment_image: commentImage.trim(),
                },
            });
    
            editor.commands.setContent('');

            setCommentImage('');
    
            setLoading(false);

        } catch (errors) {
            console.log(errors);

            setLoading(false);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);

        };
    };

    const updatePost = () => {
        setEditPost(!editPost);

        setPostUpdate(!postUpdate);

        editor.commands.setContent(post.body);
    };

    const clearUpdatePost = () => {
        setPostUpdate(!postUpdate);

        editor.commands.setContent('');

        setKey(Math.random());
    };

    const submitUpdatedPost = async (e: React.FormEvent) => {
        e.preventDefault();

        const postBody = htmlBody;

        try {
            const { data: postContent, error: postError } = await supabase
            .from('post')
            .update({ 
                'body': postBody, 
                'post_title': title.trim(),
            })
            .eq('id', post.id);

            console.log(postError);

            const { data: updateImageOne, error: imageOneError } = await supabase
            .from('images')
            .update({ 
                'url': imageOne.trim(), 
            })
            .eq('id', post.images[0].id);

            const { data: updateImageTwo, error: imageTwoError } = await supabase
            .from('images')
            .update({ 
                'url': imageTwo.trim(), 
            })
            .eq('id', post.images[1].id);

            const { data: updateImageThree, error: imageThreeError } = await supabase
            .from('images')
            .update({ 
                'url': imageThree.trim(), 
            })
            .eq('id', post.images[2].id);

            const { data: updateImageFour, error: imageFourError } = await supabase
            .from('images')
            .update({ 
                'url': imageFour.trim(), 
            })
            .eq('id', post.images[3].id);

            const { data: updateImageFive, error: imageFiveError } = await supabase
            .from('images')
            .update({ 
                'url': imageFive.trim(), 
            })
            .eq('id', post.images[4].id);

            setPostUpdate(!postUpdate);

            editor.commands.setContent('');
    
            setKey(Math.random());

            router.reload();

        } catch (errors) {
            console.log(errors);

            setLoading(false);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);

        };
    };

    const updateComment = () => {
        setEditComment(!editComment);

        setCommentUpdate(!commentUpdate);

        for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === commentId) {
                editor.commands.setContent(comments[i].text);

                setUpdateCommentImage(comments[i].comment_image)
            };
        };
    };

    const clearUpdateComment = () => {
        setCommentUpdate(!commentUpdate);

        editor.commands.setContent('');

        setKey(Math.random());
    };

    const submitUpdatedComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const commentBody = htmlBody;

        try {
            const { data, error } = await supabase
            .from('comments')
            .update({ 'text': commentBody, 'comment_image': updateCommentImage.trim() })
            .eq('id', commentId);

            setCommentUpdate(!commentUpdate);

            editor.commands.setContent('');
    
            setKey(Math.random());

            router.reload();

        } catch (errors) {
            console.log(errors);

            setLoading(false);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);

        };
    };

    const removeComment = async () => {
        setLoading(true);

        try {
            await deleteComment({
                variables: {
                    id: commentId,
                },
            });

            setCommentUpdate(!commentUpdate);

            editor.commands.setContent('');
    
            setKey(Math.random());

            setLoading(false);

        } catch (errors) {
            console.log(errors);

            setLoading(false);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);

        };
    };

    const removePost = async () => {
        setLoading(true);

        try {
            const { data, error } = await supabase
            .from('post')
            .update({ 'active': 0 })
            .eq('id', post.id);

            setCommentUpdate(!commentUpdate);

            editor.commands.setContent('');
    
            setKey(Math.random());

        } catch (errors) {
            console.log(errors);

            setLoading(false);

            setError(true);

            setTimeout(() => {
                setError(false);
            }, 5000);

        };
        setTimeout(() => {
            setLoading(false);

            Router.push('https://helpcat.io/');
        }, 100);
        

        setTimeout(() => {
            Router.reload();
        }, 500);
    };

    const images = post?.images?.filter(image => image.url !== '');

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;

        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;

        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;

        const newIndex = isLastSlide ? 0 : currentIndex + 1;

        setCurrentIndex(newIndex);
    };

    const imageDisplayNumber = currentIndex + 1;

    return (
        <>
            {session ? (
                <>
                    <div className='hidden lg:flex justify-between font-sans mb-[2rem] bg-darkPurple dark:bg-bgBlue/20 mx-[2rem] mt-[1rem] p-[2rem] rounded-md'>
                        <div className={`relative flex flex-col ${post?.images[0]?.url === '' ? '2xl:w-[100%] lg:w-[100%]' : '2xl:w-auto lg:w-[30rem] mr-6'}`}>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center mb-[1rem]'>
                                    <img 
                                        src={post?.user_image} 
                                        referrerPolicy='no-referrer' 
                                        className='rounded-full mr-2' 
                                        width={30} 
                                        height={30} 
                                    />

                                    <p className=' text-xs font-normal text-lightBlue dark:text-white'>
                                        <Link href={`/topic/${post?.topics[0]?.title}`}>
                                            <span className='dark:text-neonBlueGreen uppercase cursor-pointer text-darkBlue font-medium'>{post?.topics[0]?.title}</span>
                                        </Link> • {post?.username} posted <TimeAgo date={post?.post_created_at} /> 
                                    </p>

                                    {post?.user_email === session?.user?.email && (
                                        <>
                                            <TbEdit className='text-sm ml-2 text-upvote/90 cursor-pointer' onClick={updatePost}/>
                                        </>
                                    )}
                        
                                </div>

                            </div>

                            <div className='text-center mb-[2rem] uppercase text-pastelPink dark:text-white'>
                                <p>{post?.post_title}</p>
                            </div>

                            <div className={`flex mb-[4rem] flex-col ${post?.images[0]?.url === '' ? '' : '2xl:w-[30rem]' } overflow-auto text-sm`}>
                                {parse(body)}
                            </div>

                            <div className='flex absolute bottom-0 items-center mt-[2rem] space-x-10'>
                                <div className='flex items-center hover:bg-black dark:hover:bg-white/10 hover:text-white p-1 rounded-md cursor-pointer'>
                                    <BiMessageDetail className=' dark:text-neonBlueGreen text-darkBlue text-sm' />

                                    <p className='text-xs ml-1 font-light'>{post?.comments?.length} {post?.comments?.length === 1 ? 'Comment' : 'Comments'}</p>

                                </div>

                                <div className='flex items-center hover:bg-black dark:hover:bg-white/10 hover:text-white p-1 rounded-md cursor-pointer'>
                                    <TbPhoto className='dark:text-neonBlueGreen text-darkBlue text-sm' />

                                    <p className='text-xs ml-1 font-light'>{images?.length} {images?.length === 1 ? 'Image' : 'Images'}</p>

                                </div>

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

                        </div>

                        {images?.length > 0 && (
                            <div className='flex p-[1rem] justify-end flex-col w-[100%] sticky self-start top-[9.5rem]'>
                                <div className='flex space-x-0 bg-black/50 dark:bg-darkBlue/30 rounded-full ml-2 text-center w-fit mb-2 items-center'>
                                    <div 
                                        className='text- dark:hover:text-neonBlueGreen text-white hover:text-darkBlue rounded-md' 
                                        onClick={goToPrevious}
                                    >
                                        <MdKeyboardArrowLeft className='cursor-pointer' />
                                    </div>

                                    <div>
                                        <p className='text-sm text-white'>{imageDisplayNumber}</p>
                                    </div>

                                    <div 
                                        className='text- dark:hover:text-neonBlueGreen hover:text-darkBlue text-white rounded-md' 
                                        onClick={goToNext}
                                    >
                                        <MdKeyboardArrowRight className='cursor-pointer' />
                                    </div>
                                    
                                </div>
                                
                                <img 
                                    src={images[currentIndex]?.url} className='object-contain'
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

                    </div>

                    <p className='text-xs lex flex-col justify-between font-sans mb-2 mx-[2rem]'>Comment as {session?.user?.name}</p>

                    {!postUpdate && !commentUpdate && (
                        <div className='flex flex-col justify-between font-sans mb-[2rem] mx-[2rem] p-[1rem] rounded-md border dark:border-bgBlue/20 border-darkPurple'>
                            <form className='flex flex-col flex-1' onSubmit={submitNewComment}>

                                <div className='flex items-center'>
                                    <div>
                                        <TbPhoto /> 
                                    </div>

                                    <div className='flex items-center'>
                                        <input 
                                            type='text' 
                                            className='ml-1 font-light placeholder-white/70 dark:placeholder-white/70 w-[15rem] outline-none bg-bgPurple dark:bg-black text-xs'
                                            placeholder='Add an image' 
                                            onChange={handleCommentImage}
                                            value={commentImage}
                                            disabled={!session}
                                            autoComplete='off'
                                            spellCheck='false' 
                                        />
                                    </div>

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
                                    <EditorContent key={key} editor={editor} />
                                </div>

                                <div className='mt-[3rem] flex items-center justify-center'>
                                    <ButtonAnimation 
                                        className='dark:bg-bgPurple bg-black/50 text-white px-2 py-1 rounded-md text-sm'
                                        disabled={!session || htmlBody === '<br/>'}
                                        type='submit'
                                    >
                                        SUBMIT
                                    </ButtonAnimation>
                                </div>

                            </form>

                        </div>
                    )}

                    {comments?.length > 0 && (
                        <div className='flex flex-col font-sans mb-[2rem] mx-[2rem] space-y-[1rem]'>
                            {comments?.map((comment) => (
                                <div 
                                    key={comment.id} 
                                    className='p-[1rem] bg-darkPurple dark:bg-bgBlue/20 rounded-md'
                                    onMouseOver={(() => setCommentId(comment.id))}
                                >
                                    <div className='flex mb-4 text-xs'>
                                        <img 
                                            src={comment.user_image} 
                                            referrerPolicy='no-referrer'
                                            className='rounded-full mr-2' 
                                            width={30} 
                                            height={30} 
                                        />
            
                                        <span className='text-white/70 font-light'>
                                            <span className='mr-0.5 font-semibold text-white'>
                                                {comment.username}
                                            </span>{' '} 
                                            • <TimeAgo date={comment.created_at} className='ml-0.5' />
                                        </span>

                                        {comment.user_email === session?.user?.email && (
                                            <>
                                                <TbEdit 
                                                    className='text-sm ml-2 text-upvote/90 cursor-pointer flex items-center justify-center'
                                                    onClick={updateComment}
                                                />
                                            </>
                                        )}
            
                                    </div>
            
                                    <div className='text-sm font-light font-sans'>
                                        <div>
                                            {parse(comment.text)}
                                        </div>

                                        <div className='mt-[1rem]'>
                                            <img src={comment.comment_image} className='rounded-md' />
                                        </div>
                                        
                                    </div>
            
                                </div>
                            ))} 

                            {commentUpdate && (
                                <div className='fixed w-[100vw] h-[100%] top-0 left-0 z-100 dark:bg-black bg-bgPurple overflow-x-hidden overflow-y-scroll'>
                                    <div 
                                        className='flex flex-col items-center justify-center mt-[9rem]' 
                                        
                                    >
                                        <MdOutlineKeyboardBackspace
                                            className='text-xl mb-[1rem] cursor-pointer' 
                                            onClick={clearUpdateComment} 
                                        />

                                        <div>
                                            <input 
                                                type='text' 
                                                autoComplete='off'
                                                className='placeholder-white/80 dark:placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                                disabled={!session}
                                                onChange={handleUpdateCommentImage}
                                                value={updateCommentImage}
                                                placeholder={session ? '[IMAGE URL]' : '- - -'}
                                            />
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

                                        <div className='mt-[2rem] flex items-center justify-center'>
                                            <ButtonAnimation 
                                                className='dark:bg-bgPurple bg-black/50 text-white px-2 py-1 rounded-md text-sm mb-[3rem] mr-[1rem]'
                                                disabled={!session || htmlBody === '<br/>'}
                                                type='submit'
                                                onClick={submitUpdatedComment}
                                            >
                                                UPDATE
                                            </ButtonAnimation>

                                            <button 
                                                className=' dark:text-black bg-redError/70 text-white px-2 py-1 rounded-md text-sm mb-[3rem]'
                                                disabled={!session}
                                                type='submit'
                                                onClick={removeComment}
                                            >
                                                DELETE
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {postUpdate && (
                        <div className='fixed w-[100vw] h-[100%] top-0 left-0 z-100 dark:bg-black bg-bgPurple overflow-x-hidden overflow-y-scroll'>
                            <form 
                                className='flex flex-col items-center justify-center mt-[9rem]' 
                                onSubmit={submitUpdatedPost}
                            >
                                <MdOutlineKeyboardBackspace
                                    className='text-xl mb-[1rem] cursor-pointer' 
                                    onClick={clearUpdatePost} 
                                />

                                <div className='flex flex-col'>
                                    <input 
                                        type='text' 
                                        autoComplete='off'
                                        className='placeholder-white/80 dark:placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                        disabled={!session}
                                        onChange={handleTitleChange}
                                        value={title}
                                        placeholder={session ? '[TITLE]' : '[LOGIN TO POST]'}
                                    />

                                    <input 
                                        type='text' 
                                        autoComplete='off'
                                        className='placeholder-white/80 dark:placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                        disabled={!session}
                                        onChange={handleImageOneChange}
                                        value={imageOne}
                                        placeholder={session ? '[IMAGE URL]' : '- - -'}
                                    />

                                    <input 
                                        type='text' 
                                        autoComplete='off'
                                        className='placeholder-white/80 dark:placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                        disabled={!session}
                                        onChange={handleImageTwoChange}
                                        value={imageTwo}
                                        placeholder={session ? '[IMAGE URL]' : '- - -'}
                                    />

                                    <input 
                                        type='text' 
                                        autoComplete='off'
                                        className='placeholder-white/80 dark:placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                        disabled={!session}
                                        onChange={handleImageThreeChange}
                                        value={imageThree}
                                        placeholder={session ? '[IMAGE URL]' : '- - -'}
                                    />

                                    <input 
                                        type='text' 
                                        autoComplete='off'
                                        className='placeholder-white/80 dark:placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                        disabled={!session}
                                        onChange={handleImageFourChange}
                                        value={imageFour}
                                        placeholder={session ? '[IMAGE URL]' : '- - -'}
                                    />

                                    <input 
                                        type='text' 
                                        autoComplete='off'
                                        className='placeholder-white/80 dark:placeholder-white/80 w-[30rem] outline-none bg-bgPurple dark:bg-black mb-[2rem] text-sm border-b'
                                        disabled={!session}
                                        onChange={handleImageFiveChange}
                                        value={imageFive}
                                        placeholder={session ? '[IMAGE URL]' : '- - -'}
                                    />

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

                                <div className='mt-[2rem] flex items-center justify-center'>
                                    <ButtonAnimation 
                                        className='dark:bg-bgPurple bg-black/50 text-white px-2 py-1 rounded-md text-sm mb-[3rem] mr-[1rem]'
                                        disabled={!session || htmlBody === '<br/>' || title === ''}
                                        type='submit'
                                    >
                                        UPDATE
                                    </ButtonAnimation>

                                    <button 
                                        className=' dark:text-black bg-redError/70 text-white px-2 py-1 rounded-md text-sm mb-[3rem]'
                                        disabled={!session}
                                        type='submit'
                                        onClick={removePost}
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {!post && (
                        <HelpcatPageLoader />
                    )}

                    {loading && (
                        <HelpcatLoading />
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

export default PostPage;

const ButtonAnimation = styled.button`
    cursor: pointer;

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