import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { bigNumToStr, displayAddress } from "./commonFunctions";

import downArrow from '../img/downArrow.png';

import VaultABI from '../artifacts/Vault.json';
import DonatorsABI from "../artifacts/Donators.json";
import AssetABI from '../artifacts/USDC.json';
//import ATokenABI from '../artifacts/AToken.json';
import KarmaABI from '../artifacts/Karma.json';

// New contracts :
const donatorsAddr =    "0xABDc8f641CD563104b5FD9028D9C223a123081ec";   // need vault + migrator
//const donatorsAddr =    "0x109EF0b8127Bb1AedbeFe681c37Da900C3D78dce";   // need vault + migrator
const karmaAddr =       "0x7D88900f025397a2E396A8887315c42b21020D62";   // need vault
const vaultAddr =       "0x71b7baAf02a51EC4eE253c0aF62721A81C17C1b9";   // need associations + donators + karma + yieldmaker
// 
// migratorAddr =       "0x70B63edA4E72D9a33fea01A4480ED495CFAf0433";
// yieldMakerAddr =     "0xd7673d9e4f97FbBFE6B04a3b9eEE3e8520A6842F";
// associationsAddr =   "0x02dd14e2abB9bd3F71Ea12eF258E575766077071";
// donatorsAddr =       "0xde2736d5eB0548542eaDF9Cf2f0eb2dBe99fF70d";

const USDCAddr = "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43";
//const aUSDCAddr = "0x1Ee669290939f8a8864497Af3BC83728715265FF";

export function VAULT_USDC_AAVE() {
   const [success, setSuccess] = useState();
   const [error, setError] = useState();
   const [waiting, setWaiting] = useState();

   const [manageSwitch, setManageSwitch] = useState(true);
   const [soulSwitch, setSoulSwitch] = useState(true);

   const [amount, setAmount] = useState();
   const [transactionHash, setTransactionHash] = useState();
   const [balance, setBalance] = useState();
   const [totalBalance, setTotalBalance] = useState();
   const [donations, setDonations] = useState();
   const [karmaAmount, setKarmaAmount] = useState();

   const [currentAsso, setCurrentAsso] = useState({ name: "Dev", wallet: "0x14B059c26a99a4dB9d1240B97D7bCEb7C5a7eE13" });

   const [available, setAvailable] = useState();

   const assoArray = [
      { name: "dev", wallet: "0x14B059c26a99a4dB9d1240B97D7bCEb7C5a7eE13" },
      { name: "Autism Research Institute", wallet: "0xCbBB5002A10aAE351E6B77AA81757CC492A18E3F" },
      { name: "Associations 4DEV", wallet: "0x54C470f15f3f34043BB58d3FBB85685B39E33ed8" }
   ];
   const decimals = 6;

   useEffect(() => {       // Chargement page
      refresh();
      // eslint-disable-next-line
   }, [])
   useEffect(() => {       // Popups
      refresh();
      // eslint-disable-next-line
   }, [success, error, currentAsso])
   useEffect(() => {       // Update for wallet change
      if (window.ethereum) {
         window.ethereum.on("chainChanged", () => {
            window.location.reload();
         });
         window.ethereum.on("accountsChanged", () => {
            window.location.reload();
         });
      }
   }, [])
   useEffect(() => {       // Update total donation interval
      const interval = setInterval(() => {
         //getTotalDonations();
      }, 30 * 1000);
      return () => clearInterval(interval);
      // eslint-disable-next-line
   }, []);
   function refresh() {
      if (currentAsso.wallet !== "") {
         getBalance();
         getDonations();
      }
      getKarmaBalance();
      getAvailable();
   }
   function ClearPopups() {
      setError('');
      setSuccess('');
      setWaiting('');
   }
   async function getBalance() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _balance = await vaultContract.getBalanceToken(accounts[0], USDCAddr, currentAsso.wallet);
         let _totalBalance = await vaultContract.totalAmount();
         setTotalBalance(bigNumToStr(_totalBalance, 6, decimals));
         _balance = bigNumToStr(_balance, 6, decimals);
         setBalance(_balance);
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getBalance');
      }
   }
   async function getKarmaBalance() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const assetContract = new ethers.Contract(karmaAddr, KarmaABI.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _balance = await assetContract.balanceOf(accounts[0]);
         setKarmaAmount(bigNumToStr(_balance, 6, decimals));
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getKarmaBalance');
      }
   }
   async function getDonations() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const donatorsContract = new ethers.Contract(donatorsAddr, DonatorsABI.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _assoLength = assoArray.length;
         let _donations = 0;
         for (let i = 0 ; i < _assoLength ; i++) {
            _donations += await donatorsContract.getDonatorAmounts(accounts[0], assoArray[i].wallet, USDCAddr);
         }
         _donations = bigNumToStr(_donations, 6, decimals);
         setDonations(_donations);
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getDonations');
      }
   }
   async function deposit() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      console.log(amount);
      if (typeof amount == 'undefined') {
         setError("You need to enter an amount");
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, signer);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, signer);
      try {
         const _signature = await assetContract.approve(vaultAddr, ethers.utils.parseUnits(amount, 6));
         setWaiting('waiting for signature');
         setTransactionHash(_signature.hash);
         await _signature.wait();
         const _deposit = await vaultContract.O1_deposit(USDCAddr, ethers.utils.parseUnits(amount, 6), currentAsso.wallet);
         setWaiting('waiting for deposit');
         setTransactionHash(_deposit.hash);
         await _deposit.wait();
         ClearPopups();
         setSuccess('Deposit done !');
      } catch (err) {
         setError('Error while deposit');
         console.log(err);
      }
   }
   async function depositAll() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, signer);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, signer);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         const _onWallet = await assetContract.balanceOf(accounts[0]);
         const _signature = await assetContract.approve(vaultAddr, _onWallet);
         setWaiting('waiting for signature');
         setTransactionHash(_signature.hash);
         await _signature.wait();
         const _deposit = await vaultContract.O1_deposit(USDCAddr, _onWallet, currentAsso.wallet);
         setWaiting('waiting for deposit');
         setTransactionHash(_deposit.hash);
         await _deposit.wait();
         ClearPopups();
         setSuccess('Deposit done !');
      } catch (err) {
         setError('error while depositAll');
         console.log(err);
      }
   }
   async function withdraw() {
      if (typeof amount == 'undefined') {
         setError("You need to enter an amount");
         return;
      }
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, signer);
      try {
         const _withdraw = await vaultContract.O2_withdraw(USDCAddr, ethers.utils.parseUnits(amount, 6), currentAsso.wallet);
         setWaiting('waiting for withdraw');
         setTransactionHash(_withdraw.hash);
         await _withdraw.wait();
         ClearPopups();
         setSuccess('Withdraw done !');
      } catch (err) {
         setError('Error while withdraw');
         console.log(err);
      }
   }
   async function withdrawAll() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, signer);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _overrides = {
            from: accounts[0]
         }
         const _withdraw = await vaultContract.O3_withdrall(USDCAddr, currentAsso.wallet, _overrides);
         setWaiting('waiting for withdraw');
         setTransactionHash(_withdraw.hash);
         await _withdraw.wait();
         ClearPopups();
         setSuccess('Withdraw done !');
      } catch (err) {
         setError('Error while withdrawAll');
         console.log(err);
      }
   }
   async function getAvailable() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         const _onWallet = await assetContract.balanceOf(accounts[0]);
         setAvailable(bigNumToStr(_onWallet, 6, decimals));
      } catch (err) {
         console.log(err);
      }
   }
   function setAsso() {
      for (let i = 0; i < assoArray.length; i++) {
         if (assoArray[i].name === currentAsso.name) {
            setCurrentAsso({
               name: assoArray[i].name,
               wallet: assoArray[i].wallet
            });
         }
      }
   }
   return (<div>
      <div id="popups">
         {error && (<div>
            <div className='fullBlur' />
            <button onClick={ClearPopups} className='popup-error'>{error}</button>
         </div>)}
         {success && (<div>
            <div className='fullBlur' />
            <button onClick={ClearPopups} className='popup-success'>{success}</button>
         </div>)}
         {waiting && (<div>
            <button className='popup-waiting'>
               <div className="dot-elastic"></div>
               <a href={'https://goerli.etherscan.io/tx/' + transactionHash} className='pop-waiting-link' target='_blank' rel='noreferrer' >{waiting}</a>
            </button>
         </div>)}
      </div>
      <div id="cleanse">
         {!manageSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setManageSwitch(!manageSwitch)}>
               <div>Cleanse your Karma</div>
               <img src={downArrow} style={{ height: '4vh' }} alt="down Arrow" />
            </div>
         </div>)}
         {manageSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setManageSwitch(!manageSwitch)}>
               <div>Cleanse your Karma</div>
               <img src={downArrow} style={{ height: '4vh', transform: 'rotate(180deg)' }} alt="down Arrow" />
            </div>
            <div className="line">
               <form>
                  <input type="input" list="assosList" placeholder={currentAsso.name} style={{ width: "25vw", margin: "0.5vw" }} onChange={e => setCurrentAsso({ name: e.target.value, wallet: "" })} />
                  <datalist id="assosList">
                     {assoArray.map(
                        (asso) => <option key={asso.name}>{asso.name}</option>)}
                  </datalist>
               </form>
               <button className='button-default' onClick={setAsso}>Confirm</button>
            </div>
            <div className="line">
               <div>
                  Current association
               </div>
               <div>
               {currentAsso.name}
               </div>
            </div>
            <div className="line">
               <div>
                  Wallet
               </div>
               <div>
                  {displayAddress(currentAsso.wallet, 6)}
               </div>
            </div>
            <div className="line">
               <input className='input-default' placeholder='enter amount' style={{ width: "100%" }} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="line">
               <button className='button-default' onClick={deposit}>
                  Deposit
               </button>
               <button className='button-default' onClick={depositAll}>
                  DepositAll
               </button>
            </div>
            <div className="line">
               <button className='button-default' onClick={withdraw}>
                  Withdraw
               </button>
               <button className='button-default' onClick={withdrawAll}>
                  Withdraw All
               </button>
            </div>
         </div>)}
      </div>
      <div id="soul">
         {!soulSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setSoulSwitch(!soulSwitch)}>
               <div>Behold your soul</div>
               <img src={downArrow} style={{ height: '4vh' }} alt="down Arrow" />
            </div>
         </div>)}
         {soulSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setSoulSwitch(!soulSwitch)}>
               <div>Behold your soul</div>
               <img src={downArrow} style={{ height: '4vh', transform: 'rotate(180deg)' }} alt="down Arrow" />
            </div>
            <div className="line">
               <div>Available :</div>
               <div>{available} USDC</div>
            </div>
            <div className="line">
               <div>Your deposits :</div>
               <div>{balance} USDC</div>
            </div>
            <div className="line">
               <div>Your donations :</div>
               <div>{donations} USDC</div>
            </div>
            <div className="line">
               <div>Your Karma :</div>
               <div>{karmaAmount} KRM</div>
            </div>
            <div className="box-footer">
               <div className="line">
                  <div>Total deposits :</div>
                  <div>{totalBalance} USDC</div>
               </div>
               {/*<div className="line">
                  <div>Total donations :</div>
                  <div>{fullDonations} USDC</div>
                     </div>*/}
            </div>
         </div>)}
      </div>
   </div>)
}