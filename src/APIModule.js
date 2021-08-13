import axios from 'axios';

class fetchAPI {
    async getAPI(url) {
        const res = await axios.get(url);
        const item = res.data;
        return item;
    }

    async postAPI(url, body) {
        const res = await axios.post(url, {
                items_id: body
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        return res;     
    }
}

export const APIModule = new fetchAPI();
