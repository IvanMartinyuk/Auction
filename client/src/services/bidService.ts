import { BidDTO } from "../dto/bidDTO";

export class BidService {
    baseUrl = 'http://localhost:8080/api/bid';
    async add(bid: BidDTO) {
        console.log(bid);
        let response = await fetch(this.baseUrl,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(bid)
                                });
        return response.ok;
    }
    async getAll() {
        let response = await fetch(this.baseUrl + 's');
        let data = await response.json();
        return data;
    }
    async get(id: number) {
        let response = await fetch(this.baseUrl + '/' + id);
        let data = await response.json();
        return data;
    }
    async update(bid: BidDTO) {        
        let response = await fetch(this.baseUrl,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(bid)
                    });
        return response.ok;
    }
}