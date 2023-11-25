import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { Brands } from '../../brands';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { titleCase } from '../../utils/titleCase';
import { formatTime } from '../../utils/formatTime';
import { formatLocationName } from '../../utils/formatLocationName';
import { yesNoString } from '../../utils/yesNoString';
import Clock from '../../components/Clock';
import { TbClock, TbArrowNarrowRight } from 'react-icons/tb';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Login from '../../components/Login';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { GET_STATUS } from '../../graphql/queries';
import { ADD_STATUS } from '../../graphql/mutations';
import supabase from '../../supabaseClient';

const StoreStatus = ({ data }: StoreStatus) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showOffline, setShowOffline] = useState(false);
    const [showOnline, setShowOnline] = useState(false);
    const [showUnknown, setShowUnknown] = useState(false);

    const date = new Date();

    const timeStamp = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const filteredData = data?.filter((location) => 
        location.LocationName.toLowerCase().includes(search.toLowerCase())
        || location.Timezone.toLowerCase().includes(search.toLowerCase())
        || location.StoreStatus.toLowerCase().includes(search.toLowerCase())
        || location.StoreID.toString().includes(search.toLowerCase())
    );

    let online = 0;
    let offline = 0;
    let unknown = 0;

    let onlineLocations: string[] = [];
    let offlineLocations: string[] = [];
    let unknownLocations: string[] = [];

    for (let i = 0; i < filteredData?.length; i++) {
        if (filteredData[i]?.StoreStatus === 'Online') {
            online++;

            onlineLocations = [...onlineLocations, filteredData[i].LocationName];
        };

        if (filteredData[i]?.StoreStatus === 'OffLine') {
            offline++;

            offlineLocations = [...offlineLocations, filteredData[i].LocationName];
        };

        if (filteredData[i]?.StoreStatus === 'Unknown') {
            unknown++;

            unknownLocations = [...unknownLocations, filteredData[i].LocationName];
        };
    };

    return (
        <div className='hidden lg:flex flex-col items-center justify-center mt-[1rem]'>
            <div className='sticky top-34 hidden lg:flex lg:flex-col z-40 dark:bg-black bg-bgPurple w-full items-center justify-center pb-[2rem]'>
                {Brands.map((brand) => (
                    <div key={brand.id}>
                        {router.query.brand === brand.query && (
                            <Image 
                                src={brand.image} 
                                height={50}
                                width={50}
                                className='rounded-md'
                            />
                        )}
                    </div>
                ))}

                <div className='my-[0.5rem] flex items-center bg-darkPurple dark:bg-bgBlue/20 text-xs font-normal py-2 px-3 space-x-4 rounded-md'>
                    <p className=''>Locations: {filteredData?.length}</p>
                    
                    <div 
                        className='text-online cursor-pointer'
                        onMouseEnter={(() => {setShowOnline(true)})}
                        onMouseLeave={(() => {setShowOnline(false)})}
                    >
                        Online: {online}

                        {showOnline && onlineLocations.length > 0 && (
                            <ScrollContainer className='max-h-[30rem] z-10 p-2 rounded-lg text-white bg-darkBlue dark:bg-bgBlue text-[10px] font-light'>
                                {onlineLocations.map((location) => (
                                    <p>{location}</p>
                                ))}
                            </ScrollContainer>
                        )}

                    </div>

                    <div
                        className='text-redError cursor-pointer'
                        onMouseEnter={(() => {setShowOffline(true)})}
                        onMouseLeave={(() => {setShowOffline(false)})}
                    >
                        Offline: {offline}

                        {showOffline && offlineLocations.length > 0 && (
                            <ScrollContainer className='max-h-[30rem] z-10 p-2 rounded-lg text-white bg-darkBlue dark:bg-bgBlue text-[10px] font-light'>
                                {offlineLocations.map((location) => (
                                    <p className='mr-2'>{location}</p>
                                ))}
                            </ScrollContainer>
                        )}
                        
                    </div>
                

                    <div 
                        className='text-upvote cursor-pointer'
                        onMouseEnter={(() => {setShowUnknown(true)})}
                        onMouseLeave={(() => {setShowUnknown(false)})}
                    >
                        Unknown: {unknown}

                        {showUnknown && unknownLocations.length > 0 && (
                            <ScrollContainer className='z-10 p-2 rounded-lg text-white bg-darkBlue dark:bg-bgBlue text-[10px] font-light'>                       
                                {unknownLocations.map((location) => (
                                    <p className='mr-2'>{location}</p>
                                ))}
                            </ScrollContainer>
                        )}

                    </div>

                </div>

                <form className='mt-[0.5rem]'>
                    <input
                    type='text'
                    spellCheck='false'
                    placeholder='Search Locations'
                    className='placeholder-white/80 w-[20rem] font-light rounded-md px-[1rem] py-[0.5rem] outline-none bg-darkPurple dark:bg-bgBlue/20'
                    onChange={handleChange}
                    />
                </form>
            
            </div>

            <div>
                {filteredData?.map(({ 
                    StoreID, 
                    LocationName, 
                    StoreStatus, 
                    Address1, 
                    Suburb, 
                    Postcode, 
                    State, 
                    Country, 
                    OrderingEnabled, 
                    HiddenStore, 
                    AvgOrderTime, 
                    Longitude,
                    Latitude,
                    HolidayName, 
                    Timezone,
                    PosType,
                    OrderingProviderMenus,
                    SaleTypeMenus,
                    OpeningHours,
                    OrderAfterHours,
                    Phone
                }) => (
                    <div key={StoreID} className='hover:shadow-lg hover:shadow-bgBlue/80 dark:shadow-darkPurple/40 cursor-pointer transform transition duration-500 hover:scale-[1.01] text-sm font-light bg-darkPurple dark:bg-bgBlue/20 mb-[2rem] p-[1rem] rounded-md'>
                        <div className='flex'>
                            <div className='flex-1 flex flex-col items-start justify-center'>
                                <h1 className='text-2xl mb-2 pr-[1rem] dark:text-white text-lightBlue'>{LocationName}</h1>

                                {
                                    StoreStatus === 'Online' ? (
                                        <h2 className='text-lg mb-1 text-online'>{StoreStatus}</h2>
                                    ) : StoreStatus === 'Unknown' ? (
                                        <h2 className='text-lg mb-1 text-upvote'>{StoreStatus}</h2>
                                    ) : (
                                        <h2 className='text-lg mb-1 text-redError'>
                                            {StoreStatus.charAt(0).toUpperCase() +
                                            StoreStatus.slice(1).toLowerCase()}
                                        </h2>
                                    )
                                }

                                <h2 className='text-lg mb-1'>ID: {StoreID}</h2>

                                <h2 className='w-[30rem] pr-[1rem]'>Address: {titleCase(Address1)}, {titleCase(Suburb)}, {Postcode}, {State}, {titleCase(Country)}</h2>
                            </div>

                            <div className='bg-darkBlue/10 dark:bg-bgBlue/40 p-[1rem] rounded-md'>
                                <div className='mb-3'>
                                    <h3 className='text-center font-normal text-pastelPink dark:text-white'>Configuration</h3>
                                </div>

                                <div className='grid grid-cols-2 text-left text-xs'>
                                    <p className='py-1 px-4'><span className='cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black rounded-md px-1 py-0.5'>Customer Ordering Interface: {yesNoString(OrderingEnabled)}</span></p>

                                    <p className='py-1 px-4'>
                                        <span className='px-1 py-0.5 cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black rounded-md'>
                                            Public Holiday:
                                            {
                                            HolidayName
                                            ? ` ${HolidayName}`
                                            : ' None'
                                            }
                                        </span>
                                    </p>

                                    <p className='py-1 px-4 mt-0.5'><span className='rounded-md cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black px-1 py-0.5'>Hidden on The App Picklist: {yesNoString(HiddenStore)}</span></p>

                                    <p className='py-1 px-4 mt-0.5'><span className='rounded-md cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black px-1 py-0.5'>Longitude: {Longitude}</span></p>

                                    <p className='py-1 px-4 mt-0.5'>
                                        <span className='rounded-md cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black px-1 py-0.5'>
                                            Average Order Time: {AvgOrderTime}
                                            {
                                                AvgOrderTime === 1
                                                ? ' Minute'
                                                : ' Minutes'
                                            }
                                        </span>
                                    </p>

                                    <p className='py-1 px-4 mt-0.5'><span className='px-1 py-0.5 cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black rounded-md'>Latitude: {Latitude}</span></p>

                                    <p className='py-1 px-4 mt-0.5'><span className='cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black rounded-md px-1 py-0.5'>Order After Hours: {yesNoString(OrderAfterHours)}</span></p>

                                    <p className='py-1 px-4 mt-0.5'><span className='px-1 py-0.5 cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black rounded-md'>Timezone: {Timezone}</span></p>
                                        <p className='py-1 px-4 mt-0.5'>
                                            <span className='px-1 py-0.5 cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black rounded-md'>
                                                POS:
                                                {
                                                    PosType === '1'
                                                    ? ' Legacy'
                                                    : ' Polygon'
                                                }
                                            </span>
                                        </p>

                                    <p className='py-1 px-4 mt-0.5'>
                                        <span className='cursor-pointer hover:bg-darkBlue dark:hover:bg-neonBlueGreen hover:text-black rounded-md px-1 py-0.5'>
                                            Phone: 
                                            {
                                                Phone 
                                                ? ` ${Phone}`
                                                : ' None'
                                            }
                                        </span>
                                    </p>
                                    
                                </div>

                            </div>

                        </div>

                        <div className='flex space-x-[5rem] mt-[1rem] bg-bgPurple/60 dark:bg-bgBlue/20 rounded-md p-[1rem]'>
                            <div className='flex flex-col flex-1'>
                                <div className='mb-4'>
                                    <h3 className='text-center font-normal dark:text-white text-pastelPink'>
                                        Store Trading Hours
                                    </h3>
                                </div>

                                <div className='w-max space-y-3 text-xs'>
                                    <p>
                                        Monday: 
                                        {
                                            OpeningHours.Monday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Monday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Monday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                    <p> 
                                        Tuesday: 
                                        {
                                            OpeningHours.Tuesday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Tuesday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Tuesday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                    <p> 
                                        Wednesday: 
                                        {
                                            OpeningHours.Wednesday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Wednesday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Wednesday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                    <p> 
                                        Thursday: 
                                        {
                                            OpeningHours.Thursday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Thursday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Thursday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                    <p> 
                                        Friday: 
                                        {
                                            OpeningHours.Friday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Friday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Friday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                    <p> 
                                        Saturday: 
                                        {
                                            OpeningHours.Saturday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Saturday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Saturday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                    <p> 
                                        Sunday: 
                                        {
                                            OpeningHours.Sunday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Sunday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Sunday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                    <p> 
                                        Public Holiday: 
                                        {
                                            OpeningHours.Publicholiday.OpeningTime === 'Closed' 
                                            ? ' Closed' 
                                            : (
                                                ` ${formatTime(OpeningHours.Publicholiday.OpeningTime)} 
                                                - ${formatTime(OpeningHours.Publicholiday.ClosingTime)}`
                                            )
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className='flex flex-col flex-1'>
                                <div className='mb-4'>
                                    <h3 className='text-center font-normal dark:text-white text-pastelPink'>Ordering Provider Menus</h3>
                                </div>

                                <div className='w-max space-y-3 text-xs'>
                                    <p>
                                        Deliveroo: {' '}
                                        {
                                            OrderingProviderMenus['2']
                                            ? OrderingProviderMenus['2']
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Uber: {' '}
                                        {
                                            OrderingProviderMenus['4'] 
                                            ? OrderingProviderMenus['4'] 
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Menulog: {' '}
                                        {
                                            OrderingProviderMenus['7'] 
                                            ? OrderingProviderMenus['7'] 
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Google: {' '}
                                        {
                                            OrderingProviderMenus['10'] 
                                            ? OrderingProviderMenus['10']['106'] 
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        DoorDash: {' '}
                                        {
                                            OrderingProviderMenus['12'] 
                                            ? OrderingProviderMenus['12'] 
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        TabSquare: {' '}
                                        {
                                            OrderingProviderMenus['14'] 
                                            ? OrderingProviderMenus['14'] 
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Mr Yum: {' '}
                                        {
                                            OrderingProviderMenus['15'] 
                                            ? OrderingProviderMenus['15'] 
                                            : 'None'
                                        }
                                    </p>

                                </div>
                            </div>

                            <div className='flex flex-col flex-1'>
                                <div className='mb-4'>
                                    <h3 className='text-center font-normal dark:text-white text-pastelPink'>Sale Type Menus</h3>
                                </div>

                                <div className='w-max space-y-3 text-xs'>
                                    <p>
                                        Dine In: {' '}
                                        {
                                            SaleTypeMenus['100'] 
                                            ? SaleTypeMenus['100']
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Takeaway: {' '}
                                        {
                                            SaleTypeMenus['101'] 
                                            ? SaleTypeMenus['101'] 
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Pick Up: {' '}
                                        {
                                            SaleTypeMenus['102'] 
                                            ? SaleTypeMenus['102']
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Delivery: {' '}
                                        {
                                            SaleTypeMenus['103'] 
                                            ? SaleTypeMenus['103']
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Table Ordering: {' '}
                                        {
                                            SaleTypeMenus['104'] 
                                            ? SaleTypeMenus['104'] 
                                            : 'None'
                                        }
                                    </p>

                                    <p>
                                        Web Ordering: {' '}
                                        {
                                            SaleTypeMenus['106'] 
                                            ? SaleTypeMenus['106']
                                            : 'None'
                                        }
                                    </p>

                                </div>
                            </div>

                        </div>

                        <div className='mt-[1rem] flex items-center'>
                            <TbArrowNarrowRight />
                            <Link href={`https://helpcat.io/menu/${router.query.brand}/${StoreID}`}>
                                
                                <p className='w-fit hover:underline p-1 cursor-pointer rounded-lg text-xs'>Go To Menu</p>
                            </Link>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
};

export default StoreStatus;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const brand = context?.params?.brand;

    const response = await fetch(`https://${brand}.redcatcloud.com.au/api/v1/stores`).then(res => res.json());

    const data = response.data;

    return {
        props: {
            data
        },
    };
};

const ScrollContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    max-height: 12rem;
    overflow: auto;
    position: absolute;
`