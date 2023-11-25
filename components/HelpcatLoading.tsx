import React from 'react';
import Image from 'next/image';
import helpcat from '../assets/helpcat.jpeg';
import styled from 'styled-components';

const HelpcatLoading = () => {
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
                        H<E>E</E>LPCAT I<S>S</S> UPD<A>A</A>TI<N>N</N>G T<H>H</H>E <D>D</D>ATA<B>B</B>ASE..
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default HelpcatLoading;

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