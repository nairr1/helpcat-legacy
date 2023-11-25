import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ApolloProvider } from '@apollo/client';
import Header from '../components/Header';
import client from '../apollo-client';
import Head from 'next/head';
import '../App.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<SessionProviderProps>) {
    return (
        <ApolloProvider client={client}>
            <SessionProvider session={session}>
                <ThemeProvider enableSystem={true} attribute='class'>
                    <div className='h-screen overflow-y-scroll'>
                        <Head>
                            <title>Helpcat</title>
                        </Head>

                        <Header />

                        <Component {...pageProps} />                 
                    </div>
                </ThemeProvider>
            </SessionProvider>
        </ApolloProvider>
    );
};

export default MyApp;
