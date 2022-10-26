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
import { Page1 } from './composantsJSX/Page1';
import { Page3 } from './composantsJSX/Page3';
import { Page5 } from './composantsJSX/Page5';

import JEUR from './artifacts/contracts/jeur.sol/JEUR.json';
import EURS from './artifacts/contracts/eurs.sol/EURS.json';
import Faucet from './artifacts/contracts/faucet.sol/Faucet.json';
import AssetERC20 from './artifacts/contracts/assetERC20.sol/AssetERC20.json';

//Adresses sur le testnet Goerli
let jeurAddress = "0x150d9A8b8b5DCf72CFabE303DAD915BD72B31D00";
let eursAddress = "0xC1B34a591C935156C7AAE685Eb68C6d7980a98FD";
let stablePoolFactory = "0x44afeb87c871D8fEA9398a026DeA2BD3A13F5769";
let eurPool = "0xEd0c343856a2746C3F9013d04614491eeeC7AAea";
let vault = "0x5072E57E604f685726816a9DcA3226A7dF7c1842";
let faucetAddress = "0xd7E83ea1f38f174639A8e58Df139cE89fDBE9B07";
let tokenListAddress = "0x5B2bE2Ed116DcC4Cb20b7c84BA028F8fAa8DA008";

//Décimales d'affichage du wallet
let decimales = 5;

function App() {
  const [ value, setValue ] = useState();
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ waiting, setWaiting ] = useState('');
  const [ page, setPage ] = useState("5");
  const [ state, setState ] = useState();
  const [ rpc, setRpc ] = useState();
  const [ jeurOnWallet, setJeurOnWallet ] = useState(0);
  const [ eursOnWallet, setEursOnWallet ] = useState(0);
  const [ tokenAmount, setTokenAmount ] = useState(0);
  const [ asset, setAsset ] = useState(eursAddress);
  const [ assetSymbol, setAssetSymbol ] = useState('EURs');
  const [ connectedWallet, setConnectedWallet ] = useState();
  const [ ownerConnected, setOwnerConnected ] = useState("false");

/*---- Rafraîchit au changement d'asset--- ---------------------*/
useEffect(() => {
  getRPC();
  getConnectStatus();
  getEursOnWallet();
  getJeurOnWallet();
  refresh();
}, [asset]);
useEffect(() => {
  getAssetSymbol();
}, [asset]);
useEffect(() => {
  getFaucetOwner();
}, [connectedWallet]);
/*---- Rafraîchit au chargement de la page ---------------------*/
  useEffect(() => {
    getRPC();
    getConnectStatus();
    getEursOnWallet();
    getJeurOnWallet();
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
  async function getFaucetOwner() {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(faucetAddress, Faucet.abi, provider);
    try {
      const owner = await contract.owner();
      if(owner == connectedWallet) {
        setOwnerConnected("true");
      } else {
        setOwnerConnected("false");
      }
    } catch(err) {
      console.log(err);
    }
  }
  async function getAssetSymbol() {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(asset, EURS.abi, provider);
    try {
      let data = await contract.symbol();
      setAssetSymbol(data.toString());
    } catch(err) {
      console.log(err);
    }
  }
/*---- Change le numéro de page pour affichage dans <body> -----*/
  function pageBody(_nb) {
    setPage(_nb);
    refresh();
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

/*---- Dépose la monnaie sélectionnée sur le contrat -----------*/
  async function send() {

  }
/*-----------------------------------------------------*/
/*----- Rafraîchir les wallets et le faucet -----------*/
  function refresh() {
    getFaucetAmount(asset);
    getJeurOnWallet();
    getEursOnWallet();
  }
/*-----------------------------------------------------*/
/*----- Faucet ----------------------------------------*/
  async function claimFaucet(_tokenAddress) {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractFaucet = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    const maxWithdraw = await getFaucetAmount(_tokenAddress);
    try {
      if (maxWithdraw < (100 * 10**18)) {
        console.log("Not enough funds");
        setError("Not enough funds");
        return;
      }
      setWaiting('Waiting for claiming');
      let data = await contractFaucet.claim(_tokenAddress);
      await data.wait();
      clearWaiting();
      setSuccess('You claimed with success');
      refresh();
    } catch(err) {
      setError('You cannot claim more for now');
    }
  }
  async function depositToFaucet() {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const assetContract = new ethers.Contract(asset, EURS.abi, signer);
    const faucetContract = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    try {
      setWaiting('waiting for signature');
      const signature = await assetContract.approve(faucetAddress, ethers.utils.parseUnits(value, 18));
      await signature.wait();
      setWaiting('waiting for transaction')
      const deposit = await faucetContract.refill(asset, ethers.utils.parseUnits(value, 18));
      await deposit.wait();
      clearWaiting();
      setSuccess('Deposit done !');
      refresh();
    } catch(err) {
      console.log(err);
    }
  }
  async function withdrawFromFaucet() {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const faucetContract = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    try {
      setWaiting('Waiting for transaction');
      const withdraw = await faucetContract.withdraw(asset, ethers.utils.parseUnits(value, 18));
      await withdraw.wait();
      clearWaiting();
      setSuccess('Withdraw done !');
      refresh();
    } catch(err) {
      console.log(err);
    }

  }
  async function withdrawAllFromFaucet(){
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const assetContract = new ethers.Contract(asset, EURS.abi, signer);
    const faucetContract = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    try {
      setWaiting('Waiting for withdraw');
      const _amount = await assetContract.balanceOf(faucetAddress);
      const withdraw = await faucetContract.withdraw(asset, _amount);
      await withdraw.wait();
      clearWaiting();
      setSuccess('Withdraw done !');
      refresh();
    } catch(err) {
      console.log(err);
    }
  }
  async function getFaucetAmount(_tokenAddress) {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(_tokenAddress, JEUR.abi, provider);
    try {
      let data = await contract.balanceOf(faucetAddress);
      setTokenAmount(ethers.utils.formatUnits(String(data), 18));
      return data;
    } catch(err) {
      console.log(err);
    }
  }
/*-----------------------------------------------------*/
/*----- Lire les wallets et le faucet -----------------*/
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
}
/*async function getAssetOnWallet(_tokenAddress) {
  if (typeof window.ethereum == 'undefined') {
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(_tokenAddress, AssetERC20.abi, provider);
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

/*  0000000000000000000000000000000000000000000000000000000000  */
/*  0                        HTML                            0  */
/*  0000000000000000000000000000000000000000000000000000000000  */

  return (
    <div className="App">

{/*ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}
{/*---- Header ---------------------------------------------*/}
{/*ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}
      <header className="App-header">
        <div className="App-header-logo">
          <img src={logorond} className="picfoot"/>
          <div>HumanitR</div>
        </div>
        <div className="App-header-menu">
          {(page === "1") && <button className='Header-menu-button-selected' onClick={() => pageBody("1")}>Concept</button>}
          {(page != "1") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("1")}>Concept</button>}
          {(page === "2") && <button className='Header-menu-button-selected' onClick={() => pageBody("2")}>Deposits</button>}
          {(page != "2") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("2")}>Deposits</button>}
          {(page === "3") && <button className='Header-menu-button-selected' onClick={() => pageBody("3")}>Tests</button>}
          {(page != "3") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("3")}>Tests</button>}
          {(page === "4") && <button className='Header-menu-button-selected' onClick={() => pageBody("4")}>Contracts</button>}
          {(page != "4") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("4")}>Contracts</button>}
          {(page === "5") && <button className='Header-menu-button-selected' onClick={() => pageBody("5")}>Faucets</button>}
          {(page != "5") && <button className='Header-menu-button-not-selected' onClick={() => pageBody("5")}>Faucets</button>}
        </div>
        <div className="App-header-wallet">
          {(state !== undefined) && <div>{state.slice(0,(decimales+2))}...{state.slice(-decimales)}</div>}
          {(state === undefined) && (
              <button onClick={connect}>
                Connect wallet
              </button>)}
        </div>
      </header>

{/*ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}
{/*---- Body - ---------------------------------------------*/}
{/*ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}
      <div className="App-body">
{/*---- Popups ---------------------------------------*/}
      {rpc && (<div>
        <div className='fullBlur'/>
        <button onClick={switchToGoerli} className='goerli-button'>Click to switch to Goerli Testnet</button>
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
{/*------------------------------------------------------*/}
{/*---- Page Concept ------------------------------------*/}
        {(page === "1") && (<Page1 />)}
{/*------------------------------------------------------*/}
{/*---- Page Deposits -----------------------------------*/}
        {(page === "2") && (<div>
          <div className='box'>
            <div className='line'>
              <div className='item'>{ethers.utils.commify(jeurOnWallet)} </div>
              <div className='item'>jEUR</div>
            </div>
            <div className='line'>
              <div className='item'>{ethers.utils.commify(eursOnWallet)} </div>
              <div className='item'>EURs</div>
            </div>
          </div>
          <div className='box'>
            <input placeholder='Saisir un montant' onChange={e => setValue(e.target.value)}/>
            <input list="browsers" name="myBrowser" placeholder='Choose an asset'/>
            <datalist id="browsers">
                <option value="EURs" />
                <option value="jEUR" />
            </datalist>
            <button onClick={send}>Send</button>
          </div>
        </div>
        )}

        {(page === "3") && (<Page3 />)}   {/*-- Page Tests --*/}
        {(page === "4") && (<Page4 />)}  {/*-- Page Contracts --*/}
        {(page === "5") && (<Page5 />)}   {/*-- Page Faucets --*/}
      </div>

{/*ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}
{/*---- Footer ---------------------------------------------*/}
{/*ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo*/}
      <footer className="App-footer">
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
    </div>
  );
}

export default App;
