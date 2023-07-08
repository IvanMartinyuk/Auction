import { BaseEntity } from "./entity";

export class Bid extends BaseEntity {
    price: number;
    description: string;
    startDate: Date;
    endDate: Date;
    winnerName!: string;

    constructor(id: number,
                price:number,
                description: string,
                startDate: Date,
                endDate: Date) {
        super(id);
        this.price = price;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}