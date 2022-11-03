import logorond from './img/karma.png';
import discord from './img/discord.png';
import youtube from './img/youtube.png';
import twitter from './img/twitter.png';
import email from './img/email.png';
import odysee from './img/odysee.png';
import turnDevice from './img/TurnDevice.jpg';

import './css/animations.css';
import './css/App.css';
import './css/boxes.css';
import './css/buttons-inputs.css';
import './css/dot-elastic.css';
import './css/footer.css';
import './css/header.css';
import './css/popups.css';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Page1 } from './appPages/Page1';
import { Page2 } from './appPages/Page2';
import { Page3 } from './appPages/Page3';
import { displayAddress } from './appModules/commonFunctions';
//import { TurnDevice } from './appModules/turnDevice';

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
      <div className="app">
         <div className="turnDevice">
            <div className='spaceBlock'></div>
            <img src={turnDevice} alt="Turn your device" />
            <div>Turn your device, please</div>
         </div>
         <header className='header'>
            <div className="header-logo">
               <img src={logorond} alt="rotating humanitr logo" className="picheader" />
               <div className='header-logo-text'>HumanitR</div>
            </div>
            <div className="header-menu">
               {(page === "1") && <button className='header-menu-button-selected' onClick={() => pageBody("1")}>Concept</button>}
               {(page !== "1") && <button className='header-menu-button-not-selected' onClick={() => pageBody("1")}>Concept</button>}
               {(page === "2") && <button className='header-menu-button-selected' onClick={() => pageBody("2")}>Transcend</button>}
               {(page !== "2") && <button className='header-menu-button-not-selected' onClick={() => pageBody("2")}>Transcend</button>}
               {(page === "3") && <button className='header-menu-button-selected' onClick={() => pageBody("3")}>Faucets</button>}
               {(page !== "3") && <button className='header-menu-button-not-selected' onClick={() => pageBody("3")}>Faucets</button>}
            </div>
            <div className="header-wallet">
               {(state !== undefined) && <div>{displayAddress(connectedWallet, decimales)}</div>}
               {(state === undefined) && (
                  <button onClick={connect}>
                     Connect
                  </button>)}
            </div>
         </header>
         <div className="app-body">
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
         <footer className="footer">
            <a href="https://discord.gg/psgWAmTR" target="_blank">
               <img src={discord} alt="Discord logo" className='picfooter' />
               <div className='footer-link-text'>Discord</div>
            </a>
            <a href="https://twitter.com/DvdChETH" target="_blank">
               <img src={twitter} alt="Twitter logo" className='picfooter' />
               <div className='footer-link-text'>Twitter</div>
            </a>
            <a href="https://odysee.com/@HumanitR:e" target="_blank">
               <img src={odysee} alt="Odysee logo" className='picfooter' />
               <div className='footer-link-text'>Odysee</div>
            </a>
            <a href="mailto:humanitr@proton.me" target="_blank">
               <img src={email} alt="Gmail logo" className='picfooter' />
               <div className='footer-link-text'>Email</div>
            </a>
         </footer>
      </div>
   );
}
export default App;