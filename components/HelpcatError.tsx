import React from 'react';
import Image from 'next/image';
import helpcat from '../assets/helpcat.jpeg';
import styled from 'styled-components';

const HelpcatError = () => {
    return (
        <div className='fixed w-[98vw] h-[100%] top-0 left-0 z-100 backdrop-blur-md'>
            <div className='flex flex-col items-center justify-center mt-[14rem]'>
                <HelpcatErrorAnimation>
                    <Image 
                        className='m-auto rounded-full'
                        src={helpcat} 
                        width={200}
                        height={200}
                    />
                </HelpcatErrorAnimation>

                <div className='text-center'>
                    <p className='mt-[1rem] text-xs flex items-center justify-center text-redError/70'>
                        HELPCAT ENCOUNTERED AN ERROR :(
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default HelpcatError;

// stylesheet

const HelpcatErrorAnimation = styled.div`
    animation: gelatine 0.5s infinite;

    @keyframes gelatine {
    from, to { transform: scale(1, 1); }
    25% { transform: scale(0.9, 1.1); }
    50% { transform: scale(1.1, 0.9); }
    75% { transform: scale(0.95, 1.05); }
}
`