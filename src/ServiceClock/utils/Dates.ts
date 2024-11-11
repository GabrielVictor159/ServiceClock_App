import moment from 'moment-timezone';

export const formatUTCToLocale = (dateTimeString: string, language: string) => {
    const date = new Date(dateTimeString);

    if (language === 'pt') {
        return date.toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo',
        });
    } else if (language === 'en') {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/New_York',
        });
    }
    return date.toISOString().slice(0, 16).replace('T', ' ');
};

export const formatLocaleToUTC = (localDateTimeString: string, language: string) => {
    try{
    let timeZone: string;
    if (language === 'pt') {
        timeZone = 'America/Sao_Paulo';
    } else if (language === 'en') {
        timeZone = 'America/New_York';
    } else {
        throw new Error('Idioma não suportado');
    }

    const utcDate = moment.tz(localDateTimeString, timeZone).utc().format();

    return utcDate;
    }
    catch(error:any){
        console.log(error);
    }
};
