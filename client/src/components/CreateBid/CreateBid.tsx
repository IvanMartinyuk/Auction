import { useEffect, useState } from "react";
import { BidService } from "../../services/bidService";
import { BidDTO } from "../../dto/bidDTO";
import Notification from "../Notification/Notification";

//function for set correct format to set value in input
function formatDateForInput (date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

const CreateBid = () => {
    const now = new Date();
    const [bid, setBid] = useState({
        id: 0,
        price: 0,
        description: '',
        startDate: formatDateForInput(now),
        endDate: formatDateForInput(now)
    })
    const [isShowNotification, setIsShowNotification] =  useState<boolean>(false);
    const [notifictionSettings, setNotifictionSettings] = useState({
        backgroundColor: "red",
        fontColor: "white",
        fadeTime: 1500,
        text: "Notification text"
    });

    useEffect(() => {
        //scrolling forward one hour from now for endDate
        let oneHourLater = now;
        oneHourLater.setHours(now.getHours() + 1);
        setBid({ ...bid, endDate: formatDateForInput(oneHourLater) });
    }, []);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setBid({ ...bid, [name]: value });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        //bid validation
        if(bid.price <= 0) {
            showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Price must be greater than 0' });
            return;
        }
        let endDate = new Date(bid.endDate);
        let now = new Date();    
        if(endDate <= now) {
            showNotification({...notifictionSettings, backgroundColor: 'red', text: 'EndDate must be later than now' });
            return;
        }
        //send a new bid to the server
        let bidService = new BidService();
        let bidDto = new BidDTO(bid.id, bid.price, bid.description, new Date(bid.startDate), endDate);
        bidDto.winnerName = '';
        bidService.add(bidDto).then(isOk => {
            if(isOk) {
                showNotification({...notifictionSettings, backgroundColor: 'green', text: 'Bid successfully created' });
            }
            else {
                showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Creation error' });
            }
        }).catch(error => {
            showNotification({...notifictionSettings, backgroundColor: 'red', text: 'Server error' });
        })
    };

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
        <div className="d-flex justify-content-center align-items-center h-90">
            { isShowNotification && (
                    <Notification backgroundColor={ notifictionSettings.backgroundColor }
                                  fontColor={ notifictionSettings.fontColor }
                                  fadeTime={ notifictionSettings.fadeTime }
                                  text={ notifictionSettings.text }/>
                )}
            <form className="text-center" onSubmit={handleSubmit}>
                <div>
                    <h1 className="pb-3">Bid</h1>
                    <div>
                        <label className="d-block">Description</label>
                        <textarea className="form-control"
                                  name="description"
                                  onChange={handleChange}
                                  style={{minHeight: '150px'}}
                                  required></textarea>
                    </div>
                    <div>
                        <label className="d-block">Price</label>
                        <input type="number"
                               className="form-control" 
                               name="price"
                               value={bid.price}
                               onChange={handleChange}></input>
                    </div>
                    <div className="d-flex gap-3">
                        <div>
                            <label className="d-block mb-1">Start</label>
                            <input type="datetime-local" 
                                   className="form-control"
                                   value={bid.startDate}
                                   name="startDate"
                                   onChange={handleChange}></input>
                        </div>
                        <div>
                            <label className="d-block mb-1">End</label>
                            <input type="datetime-local" 
                                   className="form-control"
                                   value={bid.endDate}
                                   name="endDate"
                                   onChange={handleChange}></input>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center m-3">
                    <button className="btn  btn-outline-dark">Create</button>
                </div>
            </form>
        </div>
    )
}

export default CreateBid;