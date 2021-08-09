import axios from 'axios';

class APIModule {
    async getAPI(url) {
        const res = await axios.get(url);
        const item = res.data;
        return item;
    }

    async getAPISoldOut(url, id) {
        try {
            const res = await axios.get(url);
            const item = res.data;
            return [item, id];
        } catch (error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        }
    }
}

export const APIModuleData = new APIModule();
