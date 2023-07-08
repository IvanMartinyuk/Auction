import { Express, Request, Response } from 'express';
import { Bid } from '../entities/bid';
import { subscribers } from '../websocket';
import { BidService } from '../services/bidService';

const bidService = new BidService();

function generateTimer(endDate: Date, bidId: number) {
    let startDate = new Date();
    let timeDifference = endDate.getTime() - startDate.getTime(); 
    setTimeout(() => {                          
                    let currentBid = bidService.get(bidId);
                    subscribers.forEach(sub => {
                        sub.emit('bidEnded', { bidDto: currentBid });
                    });
                }, timeDifference);
  }

export const BidApiInit = (app: Express) => {
    app.get('/api/bids', (req: Request, res: Response) => {
        res.json(bidService.getAll());
    });
    
    app.get('/api/bid/:id', (req: Request, res: Response) => {
      res.json(bidService.get(Number(req.params.id)));
    });
    
    app.post('/api/bid', (req: Request, res: Response) => {
      console.log(req.body.startDate);
      let bidStart = new Date(req.body.startDate);
      let bidEnd = new Date(req.body.endDate);
      let bid : Bid = {
        id: 0,
        description: req.body.description,
        price: req.body.price,
        startDate: bidStart,
        endDate: bidEnd,
        winnerName: ''
      }
      console.log(bid);
      bid = bidService.add(bid);
      if(bid != undefined) {
        generateTimer(bid.endDate, bid.id)
        subscribers.forEach(sub => {
          sub.emit('bidCreated', bid);
        })
        res.status(200).json(bid);
      }
      else
        res.sendStatus(400);
    });
    
    app.put('/api/bid', (req: Request, res: Response) => {
      let bidStart = new Date(req.body.startDate);
      let bidEnd = new Date(req.body.endDate);
      let bid : Bid = {
        id: req.body.id,
        description: req.body.description,
        price: req.body.price,
        startDate: bidStart,
        endDate: bidEnd,
        winnerName: req.body.winnerName
      }
      if(bidService.update(bid)) {
        subscribers.forEach(sub => {
          sub.emit('bidUpdated', bid);
        });
        res.sendStatus(200);
      }
      else
        res.sendStatus(400);
    });
}