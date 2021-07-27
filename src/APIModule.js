import axios from 'axios';

class APIModule {
    async getItemShouldBeDeleted(url) {
        const res = await axios.get(url);
        const item = res.data;
        return item;
    }
}

export const APIModuleData = new APIModule();
