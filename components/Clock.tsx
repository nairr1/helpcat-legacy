import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [date, setDate] = useState(
        `
        ${new Date().toLocaleDateString('en-US', {
            weekday: 'long',
        })}, 
        ${new Date().toLocaleTimeString('en-US')},
        ${new Date().toLocaleDateString()}
        `
    );

    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000);

        return () => {
        clearInterval(timerID);
        };
    }, []);

    const tick = () => {
        setDate(
            `
            ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
            })}, 
            ${new Date().toLocaleTimeString('en-US')},
            ${new Date().toLocaleDateString()}
            `
        );
    };

    return (
        <div>
            {date}
        </div>
    );
};

export default Clock;
