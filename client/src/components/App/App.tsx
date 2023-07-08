import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import NavBar from '../NavBar/NavBar';
import BidList from '../BidList/BidList';
import CreateBid from '../CreateBid/CreateBid';
import Bid from '../Bid/Bid';

const App = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Router>
        <Routes>
          <Route path='/' element={ <SignIn></SignIn> }></Route>
          <Route path='/signUp' element={ <SignUp></SignUp> }></Route>
          <Route path='/bids' element={ <BidList></BidList> }></Route>
          <Route path='/createBid' element={ <CreateBid></CreateBid> }></Route>
          <Route path='/bid/:bidId' element={ <Bid></Bid> }></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
