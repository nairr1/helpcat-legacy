import { useRouter } from 'next/router';

export const formatLocationName = (location: string) => {
    const router = useRouter();

    switch (router.query.brand) {
        case('banjos'): return `Banjo's - ${location}`;
        case('bettysburgers'): return `Betty's Burgers - ${location}`;
        case('boostjuice'): return `Boost - ${location}`;
        case('burgerurge'): return `Burger Urge - ${location}`;
        case('chatime'): return `Chatime - ${location}`;
        case('danielsdonuts'): return `${location.slice(0, 14)}s - ${location.slice(15)}`;
        case('fondamexican'): return `Fonda Mexican - ${location}`;
        case('gamichicken'): return `${location.slice(0, 5)} - ${location.slice(5)}`;
        case('grilld'): return `${location.slice(0, 8)} - ${location.slice(8)}`;
        case('hunkydory'): return `Hunky Dory - ${location}`;
        case('lonestar'): return`${location.slice(0, 10)} - ${location.slice(10)}`;
        case('nandos'): return `NANDOS - ${location}`;
        case('oakberry'): return `${location.slice(0, 14)} - ${location.slice(14)}`;
        case('olivers'): return `Oliver's - ${location}`;
        case('salsas'): return `Salsas - ${location}`;
        case('sanchurro'): return `San Churro - ${location}`;
        case('schnitz'): return `Schnitz - ${location}`;
        default: return location;
    };
};