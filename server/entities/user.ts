import { BaseEntity } from "./entity";

export class User extends BaseEntity {
    name: string;
    login: string;
    password: string;
    constructor(id: number,
                name: string,
                login: string,
                password: string) {
        super(id);
        this.name = name;
        this.login = login;
        this.password = password;
    }
}