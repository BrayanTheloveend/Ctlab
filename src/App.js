import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './Components/Main/Main';
import Profile from './Components/Main/Profile';
import Machine from './Components/Main/Machine';
import Home from './Components/Main/Home';
import Login from './Components/Main/Login';
import Registration from './Components/Main/Registration';
import DepositAndWithDraw from './Components/Main/DepositAndWithDraw';
import OwnMachine from './Components/Main/OwnMachine';
import Friends from './Components/Main/Friends';
import History from './Components/Main/History';
import ValidatePayment from './Components/Main/ValidatePayment';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Main component={<Home/>}/>} path='/'/>
      <Route element={<Main component={<Profile/>}/>} path='/profile/Account'/>
      <Route element={<Main component={<OwnMachine/>}/>} path='/profile/Machines'/>
      <Route element={<Main component={<History/>}/>} path='/profile/History'/>
      <Route element={<Main component={<Friends/>}/>} path='/profile/friends'/>
      <Route element={<ValidatePayment/>} path='/AWaittingPamentValidation/:state/machine/:machineId/amount/:amount'/>
      <Route element={<Main component={<Machine/>}/>} path='/machine'/>
      <Route element={<Main component={<DepositAndWithDraw/>}/>} path='/transWidthRem/:state/machine/:machineId/amout/:amout'/>
      <Route element={<Login/>} path='/login'/>
      <Route element={<Registration/>} path='/regis'/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
