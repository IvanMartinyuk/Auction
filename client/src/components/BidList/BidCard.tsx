import { useEffect, useState } from "react";
import { BidDTO } from "../../dto/bidDTO";
import { useNavigate } from "react-router-dom";

interface BidCardProps {
    bidDto: BidDTO;
}

//Bid card for list page
const BidCard: React.FC<BidCardProps> = ({ bidDto }) => {
    const [bid, setBid] = useState<BidDTO>(new BidDTO(0, 0, '', new Date(), new Date()));

    const navigate = useNavigate();

    useEffect(() => {
        setBid(bidDto);
    }, [])

    return (
        <button type="button" 
                className="p-3 m-3 btn btn-outline-dark d-block w-100"
                onClick={ () => navigate('/bid/' + bid.id) }>
            <div className="d-flex gap-1">
                <h2>Bid #</h2>
                <h2>{ bid.id }</h2>
            </div>
            <div className="d-flex gap-1">
                <h2>Current bid price:</h2>
                <h2>{ bid.price }</h2>
            </div>
        </button>
    )
}

export default BidCard;