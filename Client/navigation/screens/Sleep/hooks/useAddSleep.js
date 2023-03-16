import { useAuthContext } from '../../Authentication/context/AuthContext';
import { useState } from 'react';
const port = process.env['PORT'];
const ip_address = process.env['IP_ADDRESS'];

export const useAddSleep = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const id = user.id;
    const token = user.token;

    const addSleep = async (hoursSleptInput, sleepQualityInput, timestampInput) => {
        setIsLoading(true);

        console.log(`full addSleep user: ${JSON.stringify(user)}`);
        console.log(`getUserInfo ip_address: ${ip_address} : Port ${port}`);
        console.log(`id in getUserInfo: ${id}`);
        console.log(
            `useAddSleep data: hoursslept ${hoursSleptInput}, sleepquality ${sleepQualityInput}, timestamp ${timestampInput}`
        );
        const response = await fetch(
            `http://${ip_address}:${port}/api/user/sleep/add`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                },
                body: JSON.stringify({
                    userID: id,
                    hoursSlept: hoursSleptInput,
                    sleepQaulity: sleepQualityInput,
                    timestamp: timestampInput
                })
            }
        );
        console.log(`respornse of addSleep: ${JSON.stringify(response)}`);
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (!response.ok) {
            setIsLoading(false);
            setError(responseJSON.mssg);
            console.log('Error in get sleep');
        } else if (response.ok) {
            setError(null);
            setIsLoading(false);
            return responseJSON.sleep;
        }
    };

    return { addSleep, isLoading, error };
};