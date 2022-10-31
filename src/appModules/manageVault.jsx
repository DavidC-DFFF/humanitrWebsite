import { useState, useEffect } from "react";
import { ethers } from 'ethers';

import downArrow from '../img/downArrow.png';

import { bigNumToStr } from "./commonFunctions";

import VaultABI from '../artifacts/contracts/humanitr/vault.sol/Vault.json';
import Associations from "../artifacts/contracts/humanitr/associations.sol/Associations.json";

import AssetABI from '../artifacts/contracts/tools/usdc.sol/USDC.json';
import ATokenABI from '../artifacts/contracts/aave/aToken.sol/AToken.json';
import KarmaABI from '../artifacts/contracts/humanitr/karmaToken.sol/Karma.json';

//const vaultAddr = "0x7ec50DD594BF48D7a9C6771bEfF5B74Ec3811D8E";
// Vault *        0x0252423A668503d2fd09b55B167C93f1b5E43193
// Vault **       0x8c448D2F9936B1611f2170cCEBe6e8C3f6229D80  Old
// Vault ***      0xb66862A86CdD0bABD27c5D3A6Ca62dd8BEE3bC3d  Old
// Vault ****     0xfEfBE6428e002a034f40C57E60fb2F915620BD04  Old
//const associationsAddr = "0xbD34c0f5a1fB46ae0eC04Dd5Bc737a58470364cA";
//const karmaAddr = "0x9ceAB234622C6A8b61f62dC77A36Add979c1876b";
// Karma          0x9ceAB234622C6A8b61f62dC77A36Add979c1876b
// Karma          0x8675f9ac9699D6127c9b8FD2f01f521Ebbc5Dd0F Oldtruffle compile
// Karma          0x445B181d96DCeF88B459003E49480295155e0f5D *** Not Verified
// Karma          0x487eB38ffb6E7D66f0c191EA6db16ad4802Ba656 *** Verified - old// Vault

const donatorsAddr = "0x38718Dd5B6Df234467A4Df79404E310D4AbAE908";      // Verified
// Migrator       0x989cD1Fe6cC17cf51cAE97389A884b88b46F8eaf            // Verified
// YieldMaker     0xBfB4d733215204414cf86cAcd4cE65aCc5cBbB0f            // Verified
const karmaAddr = "0xF75a6A8e710831d69E732920b0aE7D92c2918DC0";         // Verified
const associationsAddr = "0xD58ac6fba529831cfFe336aaF3D64EA07D2B9c3F";  // Verified
const vaultAddr = "0x04Be176aA8781738FB9EdF4d6694aAa82097811f";         // Verified

const assoTest = "0x54C470f15f3f34043BB58d3FBB85685B39E33ed8";
const USDCAddr = "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43";
const aUSDCAddr = "0x1Ee669290939f8a8864497Af3BC83728715265FF";


export function ManageVault() {
   const [success, setSuccess] = useState();
   const [error, setError] = useState();
   const [waiting, setWaiting] = useState();
   const [manageSwitch, setManageSwitch] = useState(true);
   const [amount, setAmount] = useState();
   const [asset, setAsset] = useState(USDCAddr);
   const [asso, setAsso] = useState(assoTest);
   const [transactionHash, setTransactionHash] = useState();
   const [soulSwitch, setSoulSwitch] = useState(true);
   const [balance, setBalance] = useState();
   // eslint-disable-next-line
   const [balanceBN, setBalanceBN] = useState();
   const [donations, setDonations] = useState();
   const [fullDonations, setFullDonations] = useState();
   const [fullDeposits, setFullDeposits] = useState();
   const [karmaAmount, setKarmaAmount] = useState();
   const [tempDonation, setTempDonation] = useState();

   const decimals = 6;

   useEffect(() => {
      refresh();
      // eslint-disable-next-line
   }, [])
   useEffect(() => {
      refresh();
      // eslint-disable-next-line
   }, [success, error])
   useEffect(() => {
      if (window.ethereum) {
         window.ethereum.on("chainChanged", () => {
            window.location.reload();
         });
         window.ethereum.on("accountsChanged", () => {
            window.location.reload();
         });
      }
   }, [])
   useEffect(() => {
      const interval = setInterval(() => {
         getTotalDonations();
      }, 30 * 1000);
      return () => clearInterval(interval);
      // eslint-disable-next-line
   }, []);

   function refresh() {
      getBalance();
      getDonations();
      getTotalDeposits();
      getTotalDonations();
      getKarmaBalance();
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
         let _overrides = {
            from: accounts[0]
         }
         let _balance = await vaultContract.getBalanceToken(USDCAddr, assoTest, _overrides);
         setBalanceBN(_balance);
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
      //const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _balance = await assetContract.balanceOf(accounts[0]);
         setKarmaAmount(bigNumToStr(_balance, 6, decimals));
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getBalance');
      }
   }
   async function getDonations() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const associationsContract = new ethers.Contract(associationsAddr, Associations.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _donations = await associationsContract.getUserFullDonation(accounts[0]);
         _donations = bigNumToStr(_donations, 6, decimals);
         setDonations(_donations);
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getBalance');
      }
   }

   async function getTotalDonations() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const aTokenContract = new ethers.Contract(aUSDCAddr, ATokenABI.abi, provider);
      const associationsContract = new ethers.Contract(associationsAddr, Associations.abi, provider);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, provider);
      try {
         let _donations = await associationsContract.getFullDonation();
         let _assetStaked = await aTokenContract.balanceOf(vaultAddr);
         let _assetDeposit = await vaultContract.totalAmount();
         setFullDonations(bigNumToStr(parseInt(_donations) + parseInt(_assetStaked) - parseInt(_assetDeposit), 6, decimals));
         setTempDonation(bigNumToStr(parseInt(_assetStaked) - parseInt(_assetDeposit), 6, decimals));
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getTotalDonations');
      }
   }
   async function getTotalDeposits() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let overrides = {
         from: accounts[0]
      }
      try {
         let _totalDeposit = await vaultContract.getBalanceToken(USDCAddr, assoTest, overrides);
         _totalDeposit = bigNumToStr(_totalDeposit, 6, decimals);
         setFullDeposits(_totalDeposit);
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getTotalDeposits');
      }
   }
   async function deposit() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      setAsso(assoTest);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, signer);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, signer);
      try {
         const _signature = await assetContract.approve(vaultAddr, ethers.utils.parseUnits(amount, 6));
         setWaiting('waiting for signature');
         setTransactionHash(_signature.hash);
         await _signature.wait();
         const _deposit = await vaultContract.O1_deposit(asset, ethers.utils.parseUnits(amount, 6), asso);
         setWaiting('waiting for deposit');
         setTransactionHash(_deposit.hash);
         await _deposit.wait();
         ClearPopups();
         setSuccess('Deposit done !');
         //refresh();
      } catch (err) {
         console.log(err);
      }
   }
   async function depositAll() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      setAsso(assoTest);
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
         const _deposit = await vaultContract.O1_deposit(asset, _onWallet, asso);
         setWaiting('waiting for deposit');
         setTransactionHash(_deposit.hash);
         await _deposit.wait();
         ClearPopups();
         setSuccess('Deposit done !');
         //refresh();
      } catch (err) {
         console.log(err);
      }
   }
   async function withdraw() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      setAsset(USDCAddr);
      setAsso(assoTest);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, signer);
      try {
         const _withdraw = await vaultContract.O2_withdraw(asset, ethers.utils.parseUnits(amount, 6), asso);
         setWaiting('waiting for withdraw');
         setTransactionHash(_withdraw.hash);
         await _withdraw.wait();
         ClearPopups();
         setSuccess('Withdraw done !');
      } catch (err) {
         console.log(err);
      }
   }
   async function withdrawAll() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      setAsset(USDCAddr);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, signer);
      try {
         const _withdraw = await vaultContract.O3_withdrall(asset, asso);
         setWaiting('waiting for withdraw');
         setTransactionHash(_withdraw.hash);
         await _withdraw.wait();
         ClearPopups();
         setSuccess('Withdraw done !');
      } catch (err) {
         console.log(err);
      }
   }
   /*async function getAssoList() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const associationsContract = new ethers.Contract(associationsAddr, Associations.abi, provider);
      //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         var i = 0;
         var _asso = await associationsContract.Assos(i);
         while(_asso !== undefined) {
            setNumbers(map => new Map(map.set(_asso.name, displayAddress(_asso.wallet, decimals))));
            _asso = await associationsContract.Assos(i);
            i++;
            console.log(_asso.wallet);
      }
      } catch (err) {
         console.log(err);
      }
   }*/
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
            <div style={{ width: '100%' }}>
               {/*<div className='restriction'>Not implemented for now</div>*/}
               <div className="line">
                  <label htmlFor="asset-choice">Choose your asset :</label>
                  <input list="Asset" id="asset-choice" name="asset-choice" />
                  <datalist id="Asset">
                     {/*<option value="EURs" />*/}
                     <option value="USDC" />
                     {/*<option value="USDT" />*/}
                  </datalist>
               </div>
               <div className="line">
                  <label htmlFor="asso-choice">Choose your asso :</label>
                  <input list="Asso" id="asso-choice" name="asso-choice" />
                  <datalist id="Asso">
                     <option value="Creator" />
                     <option value="Asso1" />
                  </datalist>
               </div>
            </div>
            <div className="box-footer">
               <input className='input-default' placeholder='enter amount' onChange={e => setAmount(e.target.value)} />
               <div className="line">
                  <button className='button-default' onClick={e => { deposit() }}>Deposit</button>
                  <button className='button-default' onClick={e => { depositAll() }}>DepositAll</button>
               </div>
               <div className="line">
                  <button className='button-default' onClick={e => { withdraw() }}>Withdraw</button>
                  <button className='button-default' onClick={e => { withdrawAll() }}>Withdraw All</button>
               </div>
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
                  <div>{fullDeposits} USDC</div>
               </div>
               <div className="line">
                  <div>Total donations :</div>
                  <div>{fullDonations} USDC</div>
               </div>
               
               <div className="line">
                  <div>Temp donations :</div>
                  <div>{tempDonation} USDC</div>
               </div>
            </div>
         </div>)}
      </div>
   </div>)
}