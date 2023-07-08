export class BidDTO {
    id: number;
    price: number;
    description: string;
    startDate: Date;
    endDate: Date;
    winnerName!: string;

    constructor(id: number,
                price:number,
                description: string,
                startDate: Date,
                endDate: Date,) {
        this.id = id;
        this.price = price;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}