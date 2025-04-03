import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import AdminDetails from './components/AdminDetails';
import ResidentDetails from './components/ResidentDetails';
import SuccessPhe from './components/SuccessPage';
// import Home from '../Home';
import HomeUi from './components/HomeUi';
import HomeUi2 from './components/HomeUi2';
import HomeUi3 from './components/HomeUi3';
import HomeUi4 from './components/HomeUi4';
import HomeUi5 from './components/Home/HomeUI';
import HomeUi6 from './components/HomeResident/HomeUiResident';




const App = () => {
return (
<Router>
<Routes>
<Route path="/" element={<LogIn />} />
<Route path="/homeAdmin" element={<HomeUi4 />} /> 
<Route path="/homeResident" element={<HomeUi6 />} /> 
<Route path="/signup" element={<SignUp />} />
<Route path="/admin-details" element={<AdminDetails />} />
<Route path="/resident-details" element={<ResidentDetails />} />
<Route path="/success" element={<SuccessPhe />} />
<Route path="/login" element={<LogIn />} />

</Routes>
</Router>
);
};

export default App;