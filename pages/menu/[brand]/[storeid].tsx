import { GetServerSideProps } from 'next';
import React from 'react';
import { formatDateTime } from '../../../utils/formatDateTime';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import notfound from '../../../assets/helpcatNotFound.jpeg';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Login from '../../../components/Login';

const Menu = ({ data }: Menu) => {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <div className='flex flex-col items-center justify-center mt-[1rem]'>

            <div 
                className='mb-[1rem] text-xl flex items-center space-x-1 cursor-pointer'
                onClick={() => router.back()}
            >
                <MdOutlineKeyboardBackspace />
            </div>

            {Object.keys(data).length > 0 ? (
                <>
                    <div className='flex flex-col text-center mb-[2rem]'>
                        <h1 className='text-[2rem]'>{data?.KeyPadName}</h1>

                        <h2 className='text-lg'>{data?.KeyText}</h2>

                        <p className='text-lg'>Updated: {formatDateTime(data?.LastUpdateDate)}</p>
                    </div>

                    <div className=''>
                        {data?.Submenus?.map((menu, id) => (
                            <div 
                                key={id} 
                                className='flex flex-col justify-center mb-[2rem] rounded-md dark:bg-bgBlue/20 bg-darkPurple mx-[2rem] pt-[1rem]'
                            >
                                <div className='text-center mb-[1rem]'>
                                    <h1 className='text-2xl'>{menu.KeyPadName}</h1>

                                    <h2 className='text-lg'>{menu.KeyText}</h2>
                                </div>

                                {menu.Submenus && (
                                    <div>
                                        {menu.Submenus.map((subMenu, id) => (
                                            <div 
                                                key={id} 
                                                className='mb-[2rem]rounded-md mx-[2rem] py-[1rem]'
                                            >
                                                <div className='mb-[1rem] text-center'>
                                                    <h1 className=''>{subMenu.KeyPadName}</h1>
            
                                                    <h2 className=''>{subMenu.KeyText}</h2>
                                                </div>
            
                                                <div className='grid grid-cols-5 items-start gap-5  text-xs font-light'>
                                                    {subMenu.PLUs.map((plu, id) => (
                                                        <div 
                                                            key={id} 
                                                            className='mb-[1rem] p-2 bg-bgPurple/60 dark:bg-bgBlue/20 rounded-md space-y-1 hover:shadow-lg hover:shadow-bgBlue/80 dark:shadow-darkPurple/40 cursor-pointer transform transition duration-500 hover:scale-[1.01]'
                                                        >
                                                            <div className='mb-3 p-2 bg-darkBlue/10 dark:bg-bgBlue/40 rounded-md text-center'>
                                                                <p className='text-lg font-normal text-lightBlue dark:text-white'>{plu.PLUItem}</p>
            
                                                                <p className='text-pastelPink dark:text-white'>{plu.LongName ? plu.LongName : 'No Display Name'}</p>
                                                            </div>
            
                                                            <p className={`${plu.Available === 1 ? 'text-online' : 'text-redError'}`}>
                                                                {plu.Available === 1 ? 'Active' : 'Inactive'}
                                                            </p>
            
                                                            <p>PLU: {plu.PLUCode}</p>
            
                                                            <p>${(plu.Price / 100).toFixed(2)}</p>
            
                                                            <p>Modifer: {plu.PLUModifier ? plu.PLUModifier : 'None'}</p>
            
                                                            <p>Combo PLU: {plu.ComboPLU === 0 ? 'No' : 'Yes'}</p>
            
                                                            <p className='truncate'>Image: {plu.ImageLarge === '' ? 'None' : plu.ImageLarge}</p>
            
                                                            <p>{plu.Kilojoules} kjs</p>
            
                                                            <p>Description: {plu.Description === '' ? 'None' : plu.Description }</p>

                                                            {plu.UnavailableByRule && (
                                                                <p className='text-redError pt-2 text-center'>**Item unavailable via Polygon Central</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {menu.PLUs && (
                                    <div className='grid grid-cols-5 gap-5 px-[2rem] text-xs font-light'>
                                        {menu.PLUs.map((plu, id) => (
                                            <div 
                                                key={id} 
                                                className='mb-[1rem] p-2 rounded-md space-y-1 bg-bgPurple/60 dark:bg-bgBlue/20 hover:shadow-lg hover:shadow-bgBlue/80 dark:shadow-darkPurple/40 cursor-pointer transform transition duration-500 hover:scale-[1.01]'
                                            >
                                                <div className='mb-4 p-2 bg-darkBlue/10 dark:bg-bgBlue/40 rounded-md text-center'>
                                                    <p className='text-lg font-normal text-lightBlue dark:text-white'>{plu.PLUItem}</p>

                                                    <p className='text-pastelPink dark:text-white'>{plu.LongName ? plu.LongName : 'No Display Name'}</p>
                                                </div>

                                                <p className={`${plu.Available === 1 ? 'text-online' : 'text-redError'}`}>
                                                    {plu.Available === 1 ? 'Active' : 'Inactive'}
                                                </p>

                                                <p>PLU: {plu.PLUCode}</p>

                                                <p>${(plu.Price / 100).toFixed(2)}</p>

                                                <p>Modifer: {plu.PLUModifier ? plu.PLUModifier : 'None'}</p>

                                                <p>Combo PLU: {plu.ComboPLU === 0 ? 'No' : 'Yes'}</p>

                                                <p className='truncate'>Image: {plu.ImageLarge === '' ? 'None' : plu.ImageLarge}</p>

                                                <p>{plu.Kilojoules} kjs</p>

                                                <p>Description: {plu.Description === '' ? 'None' : plu.Description }</p>

                                                {plu.UnavailableByRule && (
                                                    <p className='text-redError pt-2 text-center'>**Item unavailable via Polygon Central</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className='mt-[1rem] flex flex-col items-center justify-center space-y-8'>
                    <p>Sorry, There's No Web Ordering Menu Data For This Location</p>

                    <HelpcatNotFound>
                        <Image 
                            className='rounded-full' 
                            src={notfound} 
                            width={100} 
                            height={100} 
                        />
                    </HelpcatNotFound>
                </div>
            )}

        </div>
    );
};

export default Menu;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const brand = context?.params?.brand;

    const storeId = context?.params?.storeid;

    const response = await fetch(`https://${brand}.redcatcloud.com.au/api/v1/stores/${storeId}/menu`).then(res => res.json());

    const data = response.data || [];

    return {
        props: {
            data
        },
    };
};

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