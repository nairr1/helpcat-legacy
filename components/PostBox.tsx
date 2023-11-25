import { useSession } from 'next-auth/react';
import React from 'react';
import Link from 'next/link';

const PostBox = () => {
    const { data: session } = useSession();
    const userName = session?.user?.name?.toUpperCase();
    const userImage: string = session?.user?.image || '';

    return (
        <div className='hidden lg:flex items-center w-[100%] dark:bg-bgBlue/20 bg-darkPurple mb-[2rem] rounded-md p-3'>
            {session && (
                <img
                    src={userImage} 
                    referrerPolicy='no-referrer' 
                    className='rounded-full mr-2' 
                    width={30} 
                    height={30} 
                />
            )}

            <Link href='/submit'>
                <input 
                    disabled={!session}
                    type='text' 
                    autoComplete='off'
                    className=' placeholder-white/80 dark:placeholder-white/80 w-[100%] outline-none dark:bg-black/50 bg-bgPurple/40 text-xs border border-black/20 dark:border-black/80 p-2 rounded-md'
                    placeholder={session ? `CREATE A POST ${userName}` : 'LOGIN TO POST'}
                />
            </Link>

        </div>
    );
};

export default PostBox;