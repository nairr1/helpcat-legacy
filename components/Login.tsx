import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import notfound from '../assets/helpcatNotFound.jpeg';

const Login = () => {
    const [delay, setDelay] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setDelay(true);
        }, 1000)

    }, []);

    return (
        <div className='absolute mt-[2rem] flex flex-col items-center justify-center'>
            {delay && (
                <>
                    <HelpcatNotFound>
                        <Image 
                            className='rounded-full' 
                            src={notfound} 
                            width={50} 
                            height={50} 
                        />
                    </HelpcatNotFound>

                    <div className='text-sm text-center mt-2'>
                        <p>Please Login, You Aren't Authorized To View This Page</p>
                    </div>
                </>
            )}

        </div>
    );
};

export default Login;

// stylesheet

const HelpcatNotFound = styled.div`
    animation: gelatine 0.5s infinite;

    @keyframes gelatine {
    from, to { transform: scale(1, 1); }
    25% { transform: scale(0.9, 1.1); }
    50% { transform: scale(1.1, 0.9); }
    75% { transform: scale(0.95, 1.05); }
}
`