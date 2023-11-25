import { useState, useEffect, MouseEvent } from 'react';
import React from 'react';
import styled from 'styled-components';
import { useTheme } from 'next-themes';
import { signIn, signOut, useSession } from 'next-auth/react';
import helpcatLogo from '../assets/helpcatLogo.png';
import Image from 'next/image';
import Link from 'next/link';
import { GET_ALL_POST_TITLES, GET_TOPIC_LIST } from '../graphql/queries';
import { useQuery } from '@apollo/client';
import { Brands } from '../brands';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import Clock from './Clock';
import helpcat from '../assets/helpcat.jpeg';
import Router from 'next/router';

const Header = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { data: session } = useSession();

    const [openSearch, setOpenSearch] = useState(false);
    const [search, setSearch] = useState('');

    const [topicDropdown, setTopicDropdown] = useState(false);
    const [storeDropdown, setStoreDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };

        const handleComplete = () => {
            setLoading(false);
        };

        Router.events.on('routeChangeStart', handleStart);

        Router.events.on('routeChangeComplete', handleComplete);

    }, [Router]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const queryMultiple = () => {
        const res1 = useQuery(GET_TOPIC_LIST);
        const res2 = useQuery(GET_ALL_POST_TITLES);

        return [res1, res2];
    };

    const [
        { data: data1, error: error1 },
        { data: data2, error: error2 },
    ] = queryMultiple();

    const topics: Topics[] = data1?.getTopicList;

    const titles: Post[] = data2?.getPostTitles;

    const filteredTitles = titles?.filter((title) => 
        title.post_title.toLowerCase().includes(search.toLowerCase())
    );

    const topicsEnter = (event: MouseEvent<HTMLUListElement | HTMLLIElement>) => {
        if (event) {
            setTopicDropdown(true);
        };
    };

    const topicsLeave = (event: MouseEvent<HTMLUListElement | HTMLLIElement>) => {
        if (event) {
            setTopicDropdown(false);
        };
    };

    const storesEnter = (event: MouseEvent<HTMLUListElement | HTMLLIElement>) => {
        if (event) {
            setStoreDropdown(true);
        };
    };

    const storesLeave = (event: MouseEvent<HTMLUListElement | HTMLLIElement>) => {
        if (event) {
            setStoreDropdown(false);
        };
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderThemeChanger = () => {
        if (!mounted) return null;

        const currentTheme = theme === 'system' ? systemTheme : theme;

        if (currentTheme === 'dark') {
            return (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-5 h-5 ml-[1rem]' role='button' onClick={() => setTheme('light')}>
                    <path d='M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z' />
                </svg>
            );
        } else {
            return (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-5 h-5 ml-[1rem]' role='button' onClick={() => setTheme('dark')}>
                    <path fillRule='evenodd' d='M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z' clipRule='evenodd' />
                </svg>
            );
        };
    };

    return (
        <div className={`font-sans dark:bg-black bg-bgPurple text-sm sticky top-0 hidden lg:flex lg:flex-col z-50 ${session ? 'pb-[1rem]' : ''}`}>
            <HeaderContainer>
                    <HeaderLeft>
                        {session && (
                            <>
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-5 h-5 mr-[0.5rem]'>
                                    <path fillRule='evenodd' d='M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z' clipRule='evenodd' />
                                </svg>

                                <input 
                                    type='text' 
                                    className='placeholder-white/80 dark:placeholder-white/80 w-[15rem] outline-none bg-bgPurple dark:bg-black'
                                    placeholder='Helpcat is here to help!' 
                                    spellCheck='false' 
                                    onChange={handleSearchChange}
                                    disabled={!session}
                                    value={search}
                                    onClick={(() => setOpenSearch(!openSearch))}
                                />
                            </>
                        )}
                    </HeaderLeft>

                <HeaderLogo className='font-sans flex items-center justify-center'>
                    <Image src={helpcatLogo} width={30} height={50} />

                    <p className='ml-2'>Helpcat&#8482;</p> 

                </HeaderLogo>

                <HeaderRight>
                    {loading && (
                        <>
                            <HelpcatLoading3Animation>
                                <Image 
                                    className='m-auto rounded-full'
                                    src={helpcat} 
                                    width={10}
                                    height={10}
                                />
                            </HelpcatLoading3Animation>

                            <div className='mr-[1rem] ml-2'>
                                <p className='text-xs'>
                                    <H>H</H><E>E</E>LPCA<T>T</T> I<S>S</S> BU<I>I</I>LDI<N>N</N><G>G</G>..
                                </p>
                            </div>
                        </>
                    )}

                    {session ? (
                        <div    
                        onClick={() => signOut()}
                        className='cursor-pointer hover:underline'
                        >
                            {session?.user?.name}
                        </div>
                    ) : (
                        <div    
                        onClick={() => signIn('google')}
                        className='cursor-pointer hover:underline'
                    >
                            Login
                        </div>
                    )}

                    {renderThemeChanger()}

                </HeaderRight>

            </HeaderContainer>

            {session && (
                <ul className='flex items-center justify-center space-x-12 mt-[1rem] font-mono'>
                    <Link href='/'>
                        <li className='cursor-pointer hover:underline'>
                            FEED
                        </li>
                    </Link>
                    
                    <li 
                        className='cursor-pointer hover:underline' 
                        onMouseEnter={topicsEnter} 
                        onMouseLeave={topicsLeave}
                    >
                        TOPICS
                    </li>
                    
                    <Link href='/storestatus'>
                        <li 
                            className='cursor-pointer hover:underline'
                            onMouseEnter={storesEnter}
                            onMouseLeave={storesLeave}
                        >
                            STORE STATUS
                        </li>
                    </Link>

                    <Link href='/menu'>
                        <li className='cursor-pointer hover:underline'>
                            MENU
                        </li>
                    </Link>

                </ul>
            )}

            {topicDropdown &&
            <div className='relative'>
                <ul 
                    className='dark:bg-black bg-bgPurple w-[99vw] grid grid-cols-3 p-[2rem] pt-[3rem] text-center absolute z-50 gap-y-6' 
                    onMouseEnter={topicsEnter} 
                    onMouseLeave={topicsLeave}
                >
                    {topics?.map((topic) => (
                        <li key={topic.id}>
                                <p className='capitalize text-xs font-sans'>
                                    <Link href={`https://helpcat.io/topic/${topic.title}`}>
                                        <span className='w-fit hover:underline cursor-pointer'>
                                            {topic.title}
                                        </span>
                                    </Link>
                                </p>
                        </li>
                    ))}
                </ul>
            </div>
            }

            {storeDropdown &&
                <div className='relative'>
                    <ul 
                        className='dark:bg-black bg-bgPurple w-[99vw] grid grid-cols-3 p-[2rem] pt-[3rem] text-center absolute z-50 gap-y-6' 
                        onMouseEnter={storesEnter} 
                        onMouseLeave={storesLeave}
                    >
                        {Brands?.map((brand) => (
                            <li key={brand.id}>
                                    <p className='capitalize text-xs font-sans'>
                                        <Link href={`https://helpcat.io/storestatus/${brand.query}`}>
                                            <span className='w-fit hover:underline cursor-pointer'>
                                                {brand.title}
                                            </span>
                                        </Link>
                                    </p>
                            </li>
                        ))}
                    </ul>
                </div>
            }

            {openSearch && (
                <div className='fixed w-[100vw] h-[100%] top-0 left-0 z-100 dark:bg-black bg-bgPurple overflow-x-hidden overflow-y-scroll'>
                    <HeaderContainer>
                        <HeaderLeft>
                            <Clock />
                        </HeaderLeft>

                        <HeaderLogo className='font-sans flex items-center justify-center'>
                            <Image src={helpcatLogo} width={30} height={50} />

                            <p className='ml-2'>Helpcat&#8482;</p> 

                        </HeaderLogo>

                        <HeaderRight>
                            {session ? (
                                <div    
                                onClick={() => signOut()}
                                className='cursor-pointer hover:underline'
                                >
                                    {session?.user?.name}
                                </div>
                            ) : (
                                <div    
                                onClick={() => signIn()}
                                className='cursor-pointer hover:underline'
                            >
                                    Login
                                </div>
                            )}

                            {renderThemeChanger()}

                        </HeaderRight>

                    </HeaderContainer>

                    <ul className='flex items-center justify-center space-x-12 mt-[1rem] font-mono'>
                        <Link href='/'>
                            <li className='cursor-pointer hover:underline'>
                                FEED
                            </li>
                        </Link>
                        
                        <li 
                            className='cursor-pointer hover:underline' 
                            onMouseEnter={topicsEnter} 
                            onMouseLeave={topicsLeave}
                        >
                            TOPICS
                        </li>
                        
                        <Link href='/storestatus'>
                            <li 
                                className='cursor-pointer hover:underline'
                                onMouseEnter={storesEnter}
                                onMouseLeave={storesLeave}
                            >
                                STORE STATUS
                            </li>
                        </Link>

                        <li className='cursor-pointer hover:underline'>
                            MENU
                        </li>

                    </ul>

                    <div className='flex flex-col items-center justify-center mt-[3rem]'>
                        
                        <MdOutlineKeyboardBackspace
                            className='text-xl mb-[1rem] cursor-pointer' 
                            onClick={(() => { setOpenSearch(!openSearch); setSearch(''); })} 
                        />

                        <input 
                            type='text' 
                            className='placeholder-white/80 dark:placeholder-white/80 w-[20rem] font-light rounded-md px-[1rem] py-[0.5rem] outline-none bg-black/30 dark:bg-bgBlue/20'
                            placeholder='SEARCH HELPCAT POSTS' 
                            spellCheck='false'
                            onChange={handleSearchChange} 
                        />

                        {search && (
                            <div className='flex items-start ml-[2rem] w-full flex-col mt-[2rem] font-light'>
                                {filteredTitles?.map((post) => (
                                    <Link 
                                        href={`https://helpcat.io/post/${post.id}`} 
                                        key={post.id}
                                    >
                                        <div className='flex mb-2'>
                                            <span className='mr-1'>•</span>  

                                            <span 
                                                className='hover:underline cursor-pointer'
                                                onClick={(() => { 
                                                    setTimeout(() => {
                                                        setOpenSearch(!openSearch);
                                                    }, 500)
                                                    
                                                    setSearch(''); 
                                                })}
                                            >
                                                {post.post_title}
                                            </span>
                                            
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                    </div>
                    
                </div>
            )}

        </div>
    );
};

export default Header;

// stylesheet

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
`
const HeaderLeft = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 2rem;
    font-weight: 350;
`

const HeaderRight = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 2rem;
    font-weight: 350;
`

const HeaderLogo = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-size: 3rem;
`

const HelpcatLoading3Animation = styled.div`
    animation: bounce3 2s ease infinite;

    display: flex;
    align-items: center;
    justify-content: center;

    @keyframes bounce3 {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-10px);}
        60% {transform: translateY(-5px);}
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

const I = styled.span`
    animation: i 2.5s linear infinite;

    @keyframes i {
        100% {
            color: #5382d2
        }
    }
`

const N = styled.span`
    animation: n 3.5s linear infinite;

    @keyframes n {
        100% {
            color: #80eaac
        }
    }
`

const H = styled.span`
    animation: h 2s ease-in-out infinite;

    @keyframes h {
        100% {
            color: #72e6e8
        }
    }
`

const T = styled.span`
    animation: t 1.5s linear infinite;

    @keyframes t {
        100% {
            color: #d588d5
        }
    }
`

const G = styled.span`
    animation: g 1.75s ease-in-out infinite;

    @keyframes g {
        100% {
            color: #af8be9
        }
    }
`