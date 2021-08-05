import axios from 'axios';

class APIModule {
    async getAPI(url) {
        const res = await axios.get(url);
        const item = res.data;
        return item;
    }

    async getAPISoldOut(url, id) {
        const res = await axios.get(url);
        const item = res.data;
        return [item, id];
    }
}

export const APIModuleData = new APIModule();
