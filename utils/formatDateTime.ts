export const formatDateTime = (str: string) => {
    return str
        ?.slice(0, 11)
        .replace('T', '') + ', ' +
        new Date(str)
            .toLocaleTimeString(global.navigator?.language, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
            .replace(/^(?:00:)?0?/, '');
};