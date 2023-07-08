import { useEffect, useState } from "react";
import { BidDTO } from "../../dto/bidDTO";
import { useParams } from "react-router-dom";
import { BidService } from "../../services/bidService";
import { io } from "socket.io-client";
import Timer from "../Timer/Timer";
import Notification from "../Notification/Notification";

const socket = io('http://localhost:8081');

const Bid = () => {
    const [bid, setBid] = useState<BidDTO>(new BidDTO(0, 0, '', new Date(), new Date()));
    const [minBid, setMinBid] = useState<number>(0);
    const [currentBid, setCurrentBid] = useState<number>(0);
    const [isBidEnd, setIsBidEnd] = useState<boolean>(false);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isShowNotification, setIsShowNotification] =  useState<boolean>(false);
    const [notifictionSettings, setNotifictionSettings] = useState({
        backgroundColor: "red",
        fontColor: "white",
        fadeTime: 1500,
        text: "Notification text"
    });
    const searchParms = useParams();

    useEffect(() => {        
        //getting bid by id
        let bidService = new BidService();
        bidService.get(Number(searchParms.bidId)).then(bidDto => {
            setBid(bidDto);
            setMinBid(bidDto.price);
            setCurrentBid(bidDto.price);
            const now = new Date();
            const endDate = new Date(bidDto.endDate);
            let timeDifference = endDate.getTime() - now.getTime();
            if(timeDifference < 0) {
                setIsBidEnd(true);
            }

        }).catch(error => {
            showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Server error' });
        });

        if(sessionStorage.getItem('userName')) {
            setIsAuthorized(true);
        }
        
        //socket configure
        socket.on('connect', () => {
            console.log('Connected to the WebSocket server');
        });

        socket.on('bidEnded', ({ bidDto }) => {
            showNotification({...notifictionSettings, backgroundColor: '#FFC107',
                                                      fadeTime: 10000,
                                                      text: 'Time is over! Winner: ' + bidDto.winnerName 
                                                          + ' - Last bid: ' + bidDto.price + '$' });
            setBid(bidDto);
            setIsBidEnd(true);
        });

        //when bid is updated set a new price
        socket.on('bidUpdated', (bid) => {
            let bidDto = new BidDTO(bid.id, bid.price, bid.description, new Date(bid.startDate), new Date(bid.endDate));
            bidDto.winnerName = String(sessionStorage.getItem('userName'));
            setBid(bidDto);
            showNotification({...notifictionSettings, backgroundColor: 'green', text: 'Price is updated' });
        })
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleChange = (event: any) => {
        const customBid = event.target.value;
        setCurrentBid(customBid);
    };

    const sendBid = () => {
        //if the price is correct, send the new bid to the server or set the old bid otherwise
        if(currentBid > minBid) {
            let bidService = new BidService();
            let bidDto = new BidDTO(bid.id, currentBid, bid.description, new Date(bid.startDate), new Date(bid.endDate));
            bidDto.winnerName = String(sessionStorage.getItem('userName'));
            console.log('dto:' + bidDto.winnerName);
            console.log('storage:' + sessionStorage.getItem('userName'));
            bidService.update(bidDto).then(isOk => {
                console.log(isOk);
                if(isOk) {
                    setBid({ ...bid, price: currentBid });
                    showNotification({...notifictionSettings, backgroundColor: 'green', text: 'Bid is saved' });                    
                }
                else {
                    showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Saving error' });
                }
            }).catch(error => {
                showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Server error' });
            });
        }
        else {
            setBid({ ...bid, price: minBid });
        }
    }

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
        <div className="d-flex justify-content-center h-90 align-items-center">
            { isShowNotification && (
                    <Notification backgroundColor={ notifictionSettings.backgroundColor }
                                  fontColor={ notifictionSettings.fontColor }
                                  fadeTime={ notifictionSettings.fadeTime }
                                  text={ notifictionSettings.text }/>
                )}
            <div>
                {!isAuthorized && 
                    (<div style={{width: '320px'}} 
                         className="mb-3 text-center alert alert-danger p-2 ">You must be signed in to make bids</div> 
                )}
                <div className="d-flex justify-content-center">
                    <h1>Bid #</h1>
                    <h1>{ bid.id }</h1>
                </div>
                <div className="d-flex gap-2">
                    <h2>Current bid price:</h2>
                    <h2>{ bid.price + '$' }</h2>
                </div>
                <Timer endDate={ new Date(bid.endDate) }></Timer>
                { isBidEnd && (<div>
                                  <div className="d-flex gap-2">
                                      <div>Winner name: </div>
                                      <div>{ bid.winnerName }</div>
                                  </div>
                               </div> )}
                <p className="border-top border-bottom border-2 fs-4 m-2 p-2">{ bid.description }</p>
                { !isBidEnd && isAuthorized 
                            && (<div>
                                    <div className="d-flex gap-2 mt-3 mb-3">
                                        <label className="d-block fs-5 text-nowrap">Your price:</label>
                                        <input type="number"
                                                className="form-control" 
                                                name="price"
                                                value={currentBid}
                                                onChange={handleChange}></input>
                                    </div>
                                    <div className="d-flex justify-content-center m-3">
                                        <button className="btn btn-outline-dark" onClick={sendBid}>Make bid</button>
                                    </div>
                                </div>)
                }
            </div>
        </div>
    )
}

export default Bid;