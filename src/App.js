import logorond from './img/karma.png';
import discord from './img/discord.png';
import youtube from './img/youtube.png';
import twitter from './img/twitter.png';
import email from './img/email.png';
import './css/App.css';
import './css/popups.css';
import './css/page.css';
import './css/header.css';
import './css/body.css';
import './css/footer.css';
import './css/faucet.css';
import './css/dot-elastic.css';
import './css/page3.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Page1 } from './appPages/Page1';
import { Page2 } from './appPages/Page2';
import { Page3 } from './appPages/Page3';/*
import { Page4 } from './composantsJSX/Pages/Page4';
import { Page5 } from './composantsJSX/Pages/Page5';*/
import { displayAddress } from './appModules/commonFunctions';

//Décimales d'affichage du wallet
let decimales = 3;
//const usdcAddress = "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43";

function App() {
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ waiting, setWaiting ] = useState('');
  const [ page, setPage ] = useState("2");
  const [ state, setState ] = useState();
  const [ rpc, setRpc ] = useState();
  const [ connectedWallet, setConnectedWallet ] = useState();

  useEffect(() => {                             /*------------- Rafraîchit au chargement de la page -*/
    getRPC();
    getConnectStatus();
  }, []);
  useEffect(() => {                             /*---- Rafraîchit si changement de wallet ou de RPC -*/
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
/*---- Change le numéro de page pour affichage dans <body> -----*/
  function pageBody(_nb) {
    setPage(_nb);
  }
/*---- Vérifie le statut de connexion --------------------------*/
  async function getConnectStatus() {
    let accounts = await window.ethereum.request({method: 'eth_accounts'});
    accounts = ethers.utils.getAddress(accounts[0]);
    if(accounts[0] && accounts[0].length > 0) {
      setConnectedWallet(accounts);
      //setState(accounts.slice(0, 6) + "..." + accounts.slice(-5));
      setState(accounts.slice(0, 6) + "..." + accounts.slice(-5));
    } else {
      setState();
    }
  }
/*---- Ouvre l'écran de connexion de Metamask ------------------*/
  async function connect() {
    setWaiting('Waiting for wallet');
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    clearpopups();
    setState(accounts[0]);
  }
/*---- Vérifie le RPC (ici Goerli) -----------------------------*/
  async function getRPC() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x5') {
      setRpc(1);
    }
  }
/*---- Switch sur le bon RPC (ici Goerli) ----------------------*/
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
{/*------------------------------------------------------------------*/}
         <header className="App-header">         {/*---------- Header --*/}
            <div className="App-header-logo">
               <img src={logorond} alt="rotating humanitr logo" className="picfoot"/>
               <div>HumanitR</div>
            </div>
            <div className="App-header-menu">
               {(page === "1") && <button className='Header-menu-button-selected' onClick={() => pageBody("1")}>Concept</button>}
               {(page !== "1") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("1")}>Concept</button>}
               {(page === "2") && <button className='Header-menu-button-selected' onClick={() => pageBody("2")}>Deposits</button>}
               {(page !== "2") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("2")}>Deposits</button>}
               {(page === "3") && <button className='Header-menu-button-selected' onClick={() => pageBody("3")}>Faucets</button>}
               {(page !== "3") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("3")}>Faucets</button>}{/*
               {(page === "4") && <button className='Header-menu-button-selected' onClick={() => pageBody("4")}>Contracts</button>}
               {(page !== "4") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("4")}>Contracts</button>}
               {(page === "5") && <button className='Header-menu-button-selected' onClick={() => pageBody("5")}>Faucets</button>}
               {(page !== "5") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("5")}>Faucets</button>}*/}
            </div>
            <div className="App-header-wallet">
               {(state !== undefined) && <div>{displayAddress(connectedWallet, decimales)}</div>}
               {(state === undefined) && (
                  <button onClick={connect}>
                     Connect wallet
                  </button>)}
            </div>
         </header>
{/*------------------------------------------------------------------*/}
         <div className="App-body">              {/*------------ Body --*/}
{/*------------------------------------------------------------------*/}
            {rpc && (<div>                        {/*---------- Popups --*/}
               <div className='fullBlur'/>
               <button onClick={switchToGoerli} className='popup-goerli'>Click to switch to Goerli Testnet</button>
            </div>)}
            {error && (<div>
               <div className='fullBlur'/>
               <button onClick={clearpopups} className='popup-error'>{error}</button>
            </div>)}
            {success && (<div>
               <div className='fullBlur'/>
               <button onClick={clearpopups} className='popup-success'>{success}</button>
            </div>)}
            {waiting && (<div>
               <button className='popup-waiting'>
                  <div className="dot-elastic"></div>
                  {waiting}
               </button>
            </div>)} 
{/*------------------------------------------------------------------*/}
        {(page === "1") && (<Page1 />)}       {/*--------- Concept --*/}
        {(page === "2") && (<Page2 />)}       {/*-------- Deposits --*/}
        {(page === "3") && (<Page3 />)}       {/*------ Page Tests --*/}{/*
        {(page === "4") && (<Page4 />)}       {/*-- Page Contracts --*/}{/*
        {(page === "5") && (<Page5 />)}       {/*---- Page Faucets --*/}{/*
{/*------------------------------------------------------------------*/}
      </div>
{/*------------------------------------------------------------------*/}
      <footer className="App-footer">         {/*---------- Footer --*/}
        <a href="https://discord.com/">
          <img src={discord} alt="Discord logo" className='picfoot'/>
          <div className='footer-link-text'>Discord</div>
        </a>
        <a href="https://twitter.com/home">
          <img src={twitter} alt="Twitter logo" className='picfoot'/>
          <div className='footer-link-text'>Twitter</div>
        </a>
        <a href="https://www.youtube.com/">
          <img src={youtube} alt="Youtube logo" className='picfoot'/>
          <div className='footer-link-text'>Youtube</div>
        </a>
        <a href="https://mail.google.com/">
          <img src={email} alt="Gmail logo" className='picfoot'/>
          <div className='footer-link-text'>Email</div>
        </a>
      </footer>
{/*------------------------------------------------------------------*/}
    </div>
  );
}

export default App;
