import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LogIn from './sections/Module 1 Login/LogIn';
import HomeAdmin from "./sections/Module 3 AdminHome/HomeUi4";
import HomeResident from "./sections/Module 2 and 4 ResidentHome/HomeUiResident";
import SignUp from './sections/Module 1 Login/SignUp';
import AdminDetails from './sections/Module 1 Login/AdminDetails';
import ResidentDetails from './sections/Module 1 Login/ResidentDetails';
import SuccessPhe from './sections/Module 1 Login/SuccessPage';

export default function App() {
  return (

<Router>
      <Routes>
         <Route path="/" element={<LogIn/>} />
         <Route path="/homeAdmin" element={<HomeAdmin />} />
         <Route path="/homeResident" element={<HomeResident />} /> 
<Route path="/signup" element={<SignUp />} />
<Route path="/admin-details" element={<AdminDetails />} />
<Route path="/resident-details" element={<ResidentDetails />} />
<Route path="/success" element={<SuccessPhe />} />
<Route path="/login" element={<LogIn />} />
      </Routes>
</Router>

  
  );
}
