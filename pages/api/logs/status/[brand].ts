import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../../../supabaseClient';
import { GET_STATUS } from '../../../../graphql/queries';
import { ADD_STATUS } from '../../../../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const brand = req.query.brand;

    const data = req.body;

    const date = new Date();

    const timeStamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    const { data: query } = useQuery(GET_STATUS);

    const logs = query?.getStatus;

    const [addStatusLog] = useMutation(ADD_STATUS);

    try {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i])
    
            if (data[i].StoreStatus === 'Online') {
                if (logs.find((id: number) => {id === data[i].StoreID})) {
                    const { data: updateLog, error: error } = await supabase
                    .from('status')
                    .update({ 
                        'last_online': timeStamp, 
                    })
                    .match({
                        'store_id': data[i].StoreID,
                        'brand': brand
                    });
    
                    res.json(updateLog);
    
                } else {
                    const createLog = await addStatusLog({
                        variables: {
                            store_id: data[i].StoreID,
                            brand: brand,
                            last_online: timeStamp },
                    });
    
                    res.json(createLog);
                };
            };
        };
    } catch (errors) {
        console.log(errors);
    };

};