import React from 'react';
import Image from 'next/image';
import helpcat from '../assets/helpcat.jpeg';
import styled from 'styled-components';

const HelpcatPageLoader = () => {
    return (
        <div className='fixed w-[98vw] h-[100%] top-0 left-0 z-100 backdrop-blur-md'>
            <div className='flex flex-col items-center justify-center mt-[14rem]'>
                <HelpcatLoadingAnimation>
                    <Image 
                        className='m-auto rounded-full'
                        src={helpcat} 
                        width={200}
                        height={200}
                    />
                </HelpcatLoadingAnimation>

                <div>
                    <p className='mt-[1rem] text-xs'>
                        <H>H</H><E>E</E>LPCA<T>T</T> I<S>S</S> BU<I>I</I>LDI<N>N</N><G>G</G>..
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default HelpcatPageLoader;

// stylesheet

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