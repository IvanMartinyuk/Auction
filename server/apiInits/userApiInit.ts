import { Express, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { User } from '../entities/user';

const userService = new UserService();

export const UserApiInit = (app: Express) => {
    app.post('/api/user/signup', (req: Request, res: Response) => {  
        let user : User = {
            id: req.body.id,
            name: req.body.name,
            login: req.body.login,
            password: req.body.password
        }
        user = userService.add(user);
        if(user != undefined)
            res.status(200).json(user);
        else
            res.sendStatus(400);
    });
    
    app.post('/api/user/signin', (req: Request, res: Response) => {
        let user = userService.login(req.body.login, req.body.password);
        if(user != undefined) 
            res.status(200).json(user);
        else
            res.sendStatus(401);
    });
}