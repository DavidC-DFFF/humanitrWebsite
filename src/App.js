import logorond from './img/karma.png';
import discord from './img/discord.png';
import youtube from './img/youtube.png';
import twitter from './img/twitter.png';
import email from './img/email.png';
import './css/animations.css';
import './css/App.css';
import './css/boxes.css';
import './css/boxes-responsive.css';
import './css/buttons-inputs.css';
import './css/buttons-inputs-responsive.css';
import './css/dot-elastic.css';
import './css/footer.css';
import './css/footer-responsive.css';
import './css/header.css';
import './css/header-responsive.css';
import './css/popups.css';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Page1 } from './appPages/Page1';
import { Page2 } from './appPages/Page2';
import { Page3 } from './appPages/Page3';
import { displayAddress } from './appModules/commonFunctions';

let decimales = 3;

function App() {
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [waiting, setWaiting] = useState('');
   const [page, setPage] = useState("2");
   const [state, setState] = useState();
   const [rpc, setRpc] = useState();
   const [connectedWallet, setConnectedWallet] = useState();

   useEffect(() => {
      getRPC();
      getConnectStatus();
   }, []);
   useEffect(() => {
      if (window.ethereum) {
         window.ethereum.on("chainChanged", () => {
            window.location.reload();
         });
         window.ethereum.on("accountsChanged", () => {
            window.location.reload();
         });
      }
      getRPC();
      getConnectStatus();
   }, [])
   function pageBody(_nb) {
      setPage(_nb);
   }
   async function getConnectStatus() {
      let accounts = await window.ethereum.request({ method: 'eth_accounts' });
      accounts = ethers.utils.getAddress(accounts[0]);
      if (accounts[0] && accounts[0].length > 0) {
         setConnectedWallet(accounts);
         //setState(accounts.slice(0, 6) + "..." + accounts.slice(-5));
         setState(accounts.slice(0, 6) + "..." + accounts.slice(-5));
      } else {
         setState();
      }
   }
   async function connect() {
      setWaiting('Waiting for wallet');
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      clearpopups();
      setState(accounts[0]);
   }
   async function getRPC() {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x5') {
         setRpc(1);
      }
   }
   async function switchToGoerli() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      await window.ethereum.request({
         method: 'wallet_switchEthereumChain',
         params: [{ chainId: '0x5' }],
      });
   }
   function clearpopups() {
      setError('');
      setSuccess('');
      setWaiting('');
   }
   return (
      <div className="App">
         <header className="Header">
            <div className="Header-logo">
               <img src={logorond} alt="rotating humanitr logo" className="picfoot" />
               <div className='header-logo-text'>HumanitR</div>
            </div>
            <div className="Header-menu">
               {(page === "1") && <button className='Header-menu-button-selected' onClick={() => pageBody("1")}>Concept</button>}
               {(page !== "1") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("1")}>Concept</button>}
               {(page === "2") && <button className='Header-menu-button-selected' onClick={() => pageBody("2")}>Transcend</button>}
               {(page !== "2") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("2")}>Transcend</button>}
               {(page === "3") && <button className='Header-menu-button-selected' onClick={() => pageBody("3")}>Faucets</button>}
               {(page !== "3") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("3")}>Faucets</button>}
            </div>
            <div className="Header-wallet">
               {(state !== undefined) && <div>{displayAddress(connectedWallet, decimales)}</div>}
               {(state === undefined) && (
                  <button onClick={connect}>
                     Connect
                  </button>)}
            </div>
         </header>
         <div className="App-body">
            {rpc && (<div>
               <div className='fullBlur' />
               <button onClick={switchToGoerli} className='popup-goerli'>Click to switch to Goerli Testnet</button>
            </div>)}
            {error && (<div>
               <div className='fullBlur' />
               <button onClick={clearpopups} className='popup-error'>{error}</button>
            </div>)}
            {success && (<div>
               <div className='fullBlur' />
               <button onClick={clearpopups} className='popup-success'>{success}</button>
            </div>)}
            {waiting && (<div>
               <button className='popup-waiting'>
                  <div className="dot-elastic"></div>
                  {waiting}
               </button>
            </div>)}
            {(page === "1") && (<Page1 />)}
            {(page === "2") && (<Page2 />)}
            {(page === "3") && (<Page3 />)}
         </div>
         <footer className="App-footer">
            <a href="https://discord.com/">
               <img src={discord} alt="Discord logo" className='picfoot' />
               <div className='footer-link-text'>Discord</div>
            </a>
            <a href="https://twitter.com/home">
               <img src={twitter} alt="Twitter logo" className='picfoot' />
               <div className='footer-link-text'>Twitter</div>
            </a>
            <a href="https://www.youtube.com/">
               <img src={youtube} alt="Youtube logo" className='picfoot' />
               <div className='footer-link-text'>Youtube</div>
            </a>
            <a href="https://mail.google.com/">
               <img src={email} alt="Gmail logo" className='picfoot' />
               <div className='footer-link-text'>Email</div>
            </a>
         </footer>
      </div>
   );
}
export default App;