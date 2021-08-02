import axios from 'axios';

class APIModule {
    async getAPI(url) {
        const res = await axios.get(url);
        const item = res.data;
        return item;
    }

    async getAPISoldOut(url) {
        const res = await axios.get(url);
        return res;
    }
}

export const APIModuleData = new APIModule();
