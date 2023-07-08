import { User } from "../entities/user";
import { BaseService } from "./baseService";

export class UserService extends BaseService<User>{
    public login(login: string, password: string) : User | undefined {
        let user = this.entities.find(x => x.login == login && x.password == password);
        return user;
    }
}