import { BrowserRouter, Routes, Route } from 'react-router-dom';

import WalletProvider from './components/WalletProvider';
import NavBar from './components/NavBar';
import Home from './home/page';
import Member from './member/page';
import Sponsor from './sponsor/page';
import Reviewer from './reviewer/page';
import Notification from './components/Notification';
import Footer from './components/Footer';

import './index.css';

export default function App() {
  const message: string = 'Sorry, the page you requested does not exist.';

  return (
    <>
      <WalletProvider>
        <BrowserRouter>
          <NavBar />
          <div className="mx-auto max-w-4xl pt-24 text-justify">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/member" element={<Member />} />
              <Route path="/sponsor" element={<Sponsor />} />
              <Route path="/reviewer" element={<Reviewer />} />
              <Route path="*" element={<Notification message={message} />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </WalletProvider>
    </>
  );
}
