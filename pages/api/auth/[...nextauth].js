import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({user}) {
            if (
                user.email === process.env.NEXT_PUBLIC_TESTING_EMAIL
                || user.email === process.env.NEXT_PUBLIC_RAHUL_NAIR_EMAIL
                || user.email === process.env.NEXT_PUBLIC_MARCO_SUTANTO_EMAIL
                || user.email === process.env.NEXT_PUBLIC_TIANNA_KUNDERT_EMAIL
                || user.email === process.env.NEXT_PUBLIC_KRIESHA_PARULAN_EMAIL
                || user.email === process.env.NEXT_PUBLIC_MAYANK_MONGIA_EMAIL
                || user.email === process.env.NEXT_PUBLIC_SHEKAIBA_ALIZADAH_EMAIL
                || user.email === process.env.NEXT_PUBLIC_BEN_KING_EMAIL
                || user.email === process.env.NEXT_PUBLIC_BROCK_BAJJADA_EMAIL
                || user.email === process.env.NEXT_PUBLIC_BRANDEN_WHITE_EMAIL
                || user.email === process.env.NEXT_PUBLIC_DANIEL_WARD_EMAIL
                || user.email === process.env.NEXT_PUBLIC_CALLUM_FIELD_EMAIL
                || user.email === process.env.NEXT_PUBLIC_JEN_WAYMAN_EMAIL
                || user.email === process.env.NEXT_PUBLIC_DEAN_WEINMAN_EMAIL
            ) {
                return true;
            } else {
                return false;
            };
        },
    },
});