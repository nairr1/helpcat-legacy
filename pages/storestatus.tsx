import Link from 'next/link';
import React, { useState } from 'react';
import { Brands } from '../brands';
import Image from 'next/image';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import Login from '../components/Login';

const storestatus = () => {
    const { data: session } = useSession();
    const [query, setQuery] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    return (
        <div className='hidden lg:flex flex-col justify-center items-center text-center '>
            <div className='flex flex-col pb-[5rem] pt-[3rem] items-center justify-center text-center font-light'>
                <input 
                    type='text' 
                    className='placeholder-white/80 text-2xl dark:placeholder-white/80 w-[15rem] outline-none dark:bg-black bg-bgPurple mb-4'
                    placeholder='*.redcatcloud.com.au' 
                    spellCheck='false' 
                    onChange={handleChange}
                />

                <Link 
                    href={`https://helpcat.io/storestatus/${query}`} >
                    <ButtonAnimation className='text-xs px-3 py-2 bg-black/50 dark:bg-bgBlue/20 rounded-full cursor-pointer'>
                        GET STATUS
                    </ButtonAnimation>
                </Link>
            </div>

            <div className='grid grid-cols-5'>
                {Brands.map((brand) => (
                    <ul 
                        key={brand.id} 
                        
                    >
                        <li className='px-[5rem] mb-1'>
                            <Link href={`https://helpcat.io/storestatus/${brand.query}`}>
                                <ShakeContainer>
                                    <Image 
                                        src={brand.image} 
                                        height={50}
                                        width={50}
                                        className='rounded-md cursor-pointer'
                                    />
                                </ShakeContainer>
                            </Link>
                        </li>

                        <p className='mb-[10rem]'>
                            <Link href={`https://helpcat.io/storestatus/${brand.query}`}>
                                <span className='cursor-pointer hover:underline text-sm'>{brand.title}</span>
                            </Link>
                        </p>

                    </ul>
                ))}
            </div>
        </div>
    );
};

export default storestatus;

// stylesheet

const ShakeContainer = styled.div`
    :hover {
        animation: shake 1s ease-in-out;
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
`

const ButtonAnimation = styled.div`
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