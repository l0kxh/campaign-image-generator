import './App.css';
import EmailImageGen from './components/Generate/EmailImageGen';
import EmailImageGenerator from './components/EmailImageGenerator';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import Collections from './components/Collections/Collections';


function App() {
  return (
    <div>
      <Header/> 
      {/* <div style={{ display: "flex"}}> */}
      {/* <Sidebar /> */}
      {/* <EmailImageGen /> */}
      <div style={{width:"100%"}}>
        <Routes>
          {/* <Route path='/' element={<Home />} /> */}
          {/* <Route path='/collections' element={<Collections />} /> */}
          <Route path='/' element={<EmailImageGen />} />
        </Routes>
      </div>
      {/* </div> */}
    </div>
  );
}

export default App;
