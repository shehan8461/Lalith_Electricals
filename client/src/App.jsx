import {BrowserRouter ,Routes,Route, useLocation } from 'react-router-dom';

import About from './Pages/About';
import Signin from './Pages/Signin';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';

import PrivateRoutes from './components/PrivateRoutes';
import AddItem from './Pages/AddItem';
import ItemProfile from './Pages/ItemProfile';


import UpdateItem from './Pages/UpdateItem';
import OnePetShow from './Pages/OnePetShow'

import AllDetailsModern from './Pages/AllDetailsModern';

import Header from './components/header';
import AllDetailsModernNew from './Pages/AllDetailsModernNew';
import HeaderModern from './components/HeaderModern';







function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/sign-in', '/sign-up'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <HeaderModern/>}
      <Routes>
        <Route path="/" element={<AllDetailsModernNew/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/sign-in" element={<Signin/>}></Route>
        <Route path="/additem" element={<AddItem/>}></Route>
        <Route path="/sign-up" element={<SignUp/>}></Route>
       
        <Route path="/onepet/:id" element={<OnePetShow/>}></Route>
     
        <Route element={<PrivateRoutes/>}>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/items" element={<ItemProfile/>}></Route>
        <Route path="/update-item/:id" element={<UpdateItem/>}></Route>


        </Route>
 
        
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
