import type { NextPage } from 'next';
import Head from 'next/head';
import Feed from '../components/Feed';

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Helpcat</title>
            </Head>

            <Feed />
        </div>
    );
};

export default Home; 