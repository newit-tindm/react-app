import axios from 'axios';

class fetchAPI {
    async getAPI(url) {
        const res = await axios.get(url);
        const item = res.data;
        return item;
    }

    async postAPI(url, ids) {
        const res = await axios.post(url, `{"item_ids": [${ids}]}`)
            .then(res => res.data)
            .catch(error => console.error(error));
            
        return res;
    }
}

export const APIModule = new fetchAPI();
