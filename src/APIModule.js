class fetchAPI {
    async getAPI(url) {
        return await fetch(url)
            .then(res => res.text())
            .catch(error => console.error('Error: ', error));
    }

    async postAPI(url, ids) {
        const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ "item_ids": ids })
            })
            .then(res => res.json())
            .then(data => data)
            .catch(error => console.error('Error: ', error));
            
        return await res.data;
    }
}

export const APIModule = new fetchAPI();
