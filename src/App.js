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
import { Page1 } from './composantsJSX/Pages/Page1';/*
import { Page2 } from './composantsJSX/Pages/Page2';
import { Page3 } from './composantsJSX/Pages/Page3';
import { Page4 } from './composantsJSX/Pages/Page4';
import { Page5 } from './composantsJSX/Pages/Page5';*/

/*

import JEUR from './artifacts/contracts/jeur.sol/JEUR.json';
import EURS from './artifacts/contracts/eurs.sol/EURS.json';
import AssetERC20 from './artifacts/contracts/assetERC20.sol/AssetERC20.json';*/

//Adresses sur le testnet Goerli
let jeurAddress = "0x150d9A8b8b5DCf72CFabE303DAD915BD72B31D00";
let eursAddress = "0xC1B34a591C935156C7AAE685Eb68C6d7980a98FD";
/*let stablePoolFactory = "0x44afeb87c871D8fEA9398a026DeA2BD3A13F5769";
let eurPool = "0xEd0c343856a2746C3F9013d04614491eeeC7AAea";
let vault = "0x5072E57E604f685726816a9DcA3226A7dF7c1842";
let faucetAddress = "0xd7E83ea1f38f174639A8e58Df139cE89fDBE9B07";
let tokenListAddress = "0x5B2bE2Ed116DcC4Cb20b7c84BA028F8fAa8DA008";*/

//Décimales d'affichage du wallet
let decimales = 5;

function App() {
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ waiting, setWaiting ] = useState('');
  const [ page, setPage ] = useState("1");
  const [ state, setState ] = useState();
  const [ rpc, setRpc ] = useState();
  //const [ jeurOnWallet, setJeurOnWallet ] = useState(0);
  //const [ eursOnWallet, setEursOnWallet ] = useState(0);
  const [ asset, setAsset ] = useState(eursAddress);
  const [ connectedWallet, setConnectedWallet ] = useState();

/*---- Rafraîchit au changement d'asset--- ---------------------*/
useEffect(() => {
  getRPC();
  getConnectStatus();/*
  getEursOnWallet();
  getJeurOnWallet();*/
}, [asset]);
/*---- Rafraîchit au chargement de la page ---------------------*/
  useEffect(() => {
    getRPC();
    getConnectStatus();/*
    getEursOnWallet();
    getJeurOnWallet();*/
  }, []);
/*---- Rafraîchit si changement de wallet ou de RPC ------------*/
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
      setState(accounts.slice(0, 6) + "..." + accounts.slice(-5));
    } else {
      setState();
    }
  }
/*---- Ouvre l'écran de connexion de Metamask ------------------*/
  async function connect() {
    setWaiting('Waiting for wallet');
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    clearWaiting();
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
/*-----------------------------------------------------*/
/*----- Lire les wallets et le faucet -----------------*//*
async function getEursOnWallet() {
  if (typeof window.ethereum == 'undefined') {
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(eursAddress, EURS.abi, provider);
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
  try {
    let data = await contract.balanceOf(accounts[0]);
    setEursOnWallet(ethers.utils.formatUnits(data, 18));
  } catch(err) {
    console.log(err);
  }
}
async function getJeurOnWallet() {
  if (typeof window.ethereum == 'undefined') {
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(jeurAddress, JEUR.abi, provider);
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
  try {
    let data = await contract.balanceOf(accounts[0]);
    setJeurOnWallet(ethers.utils.formatUnits(data, 18));
  } catch(err) {
    console.log(err);
  }
}*/
/*-----------------------------------------------------*/
/*----- Effacer les erreurs ---------------------------*/
  function clearError() {
    setError('');
  }
  function clearSuccess() {
    setSuccess('');
  }
  function clearWaiting() {
    setWaiting('');
  }

  return (
      <div className="App">
{/*------------------------------------------------------------------*/}
         <header className="App-header">         {/*---------- Header --*/}
            <div className="App-header-logo">
               <img src={logorond} className="picfoot"/>
               <div>HumanitR</div>
            </div>
            <div className="App-header-menu">
               {(page === "1") && <button className='Header-menu-button-selected' onClick={() => pageBody("1")}>Concept</button>}
               {(page != "1") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("1")}>Concept</button>}
{/*            {(page === "2") && <button className='Header-menu-button-selected' onClick={() => pageBody("2")}>Deposits</button>}
               {(page != "2") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("2")}>Deposits</button>}
               {(page === "3") && <button className='Header-menu-button-selected' onClick={() => pageBody("3")}>Tests</button>}
               {(page != "3") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("3")}>Tests</button>}
               {(page === "4") && <button className='Header-menu-button-selected' onClick={() => pageBody("4")}>Contracts</button>}
               {(page != "4") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("4")}>Contracts</button>}
               {(page === "5") && <button className='Header-menu-button-selected' onClick={() => pageBody("5")}>Faucets</button>}
               {(page != "5") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("5")}>Faucets</button>}*/}
            </div>
            <div className="App-header-wallet">
               {(state !== undefined) && <div>{state.slice(0,(decimales+2))}...{state.slice(-decimales)}</div>}
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
               <button onClick={switchToGoerli} className='popup-goerli'/*'goerli-button'*/>Click to switch to Goerli Testnet</button>
            </div>)}
            {error && (<div>
               <div className='fullBlur'/>
               <button onClick={clearError} className='popup-error'>{error}</button>
            </div>)}
            {success && (<div>
               <div className='fullBlur'/>
               <button onClick={clearSuccess} className='popup-success'>{success}</button>
            </div>)}
            {waiting && (<div>
               <button className='popup-waiting'>
                  <div className="dot-elastic"></div>
                  {waiting}
               </button>
            </div>)} 
{/*------------------------------------------------------------------*/}
        {(page === "1") && (<Page1 />)}       {/*--------- Concept --*/}{/*
        {(page === "2") && (<Page2 />)}       {/*-------- Deposits --*/}{/*
        {(page === "3") && (<Page3 />)}       {/*------ Page Tests --*/}{/*
        {(page === "4") && (<Page4 />)}       {/*-- Page Contracts --*/}{/*
        {(page === "5") && (<Page5 />)}       {/*---- Page Faucets --*/}{/*
{/*------------------------------------------------------------------*/}
      </div>
{/*------------------------------------------------------------------*/}
      <footer className="App-footer">         {/*---------- Footer --*/}
        <a href="#">
          <img src={discord} className='picfoot'/>
          <div className='footer-link-text'>Discord</div>
        </a>
        <a href="#">
          <img src={twitter} className='picfoot'/>
          <div className='footer-link-text'>Twitter</div>
        </a>
        <a href="#">
          <img src={youtube} className='picfoot'/>
          <div className='footer-link-text'>Youtube</div>
        </a>
        <a href="#">
          <img src={email} className='picfoot'/>
          <div className='footer-link-text'>Email</div>
        </a>
      </footer>
{/*------------------------------------------------------------------*/}
    </div>
  );
}

export default App;
