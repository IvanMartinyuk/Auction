import { io } from 'socket.io-client';
import React, { useEffect, useState } from "react";
import { BidDTO } from '../../dto/bidDTO';
import BidCard from './BidCard';
import { BidService } from '../../services/bidService';
import Notification from '../Notification/Notification';

const socket = io('http://localhost:8081');

const BidList = () => {
    const [bids, setBids] = useState<BidDTO[]>([]);
    const [isShowNotification, setIsShowNotification] =  useState<boolean>(false);
    const [notifictionSettings, setNotifictionSettings] = useState({
        backgroundColor: "red",
        fontColor: "white",
        fadeTime: 1500,
        text: "Notification text"
    });

    useEffect(() => {
        let bidService = new BidService();
        bidService.getAll().then(bs => {
            setBids(bs);
        }).catch(error => {
          showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Server error' });
        })

        //socket configuration
        socket.on('connect', () => {
          console.log('Connected to the WebSocket server');
        });
    
        //When someone created a new bid, it adds to the list
        socket.on('bidCreated', (bid) => {
          setBids(bids => [...bids, bid]);
          showNotification({...notifictionSettings, backgroundColor: 'green', text: 'A new bid has been created' });
        });
    
        return () => {
          socket.disconnect();
        };
      }, []);

    const showNotification = (value: React.SetStateAction<{
          backgroundColor: string;
          fontColor: string;
          fadeTime: number;
          text: string;
      }>)  => {
          setNotifictionSettings(value);
          setIsShowNotification(true);
          setTimeout(() => {
              setIsShowNotification(false);
          }, notifictionSettings.fadeTime * 2);
      }

    return(
        <div className='d-flex justify-content-center'>
          { isShowNotification && (
                    <Notification backgroundColor={ notifictionSettings.backgroundColor }
                                  fontColor={ notifictionSettings.fontColor }
                                  fadeTime={ notifictionSettings.fadeTime }
                                  text={ notifictionSettings.text }/>
                )}
            <div>
                { bids.map(b => {
                    return(
                        <BidCard bidDto={b}></BidCard>
                    )
                }) }
            </div>
        </div>
    );
}

export default BidList;