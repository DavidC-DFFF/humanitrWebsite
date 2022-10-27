import { useEffect, useState/*, useEffect*/ } from "react";
import { ethers } from 'ethers';

import "./commonFunctions";
import downArrow from '../img/downArrow.png';

//import AssetABI from '../artifacts/contracts/tools/usdc.sol/USDC.json';
import VaultABI from '../artifacts/contracts/humanitr/vault.sol/Vault.json';
import { bigNumToStr } from "./commonFunctions";
//import ATokenABI from '../artifacts/contracts/aave/aToken.sol/AToken.json';
//import YieldMaker from '../artifacts/contracts/humanitr/yieldMaker-aave.sol/YieldMaker.dbg.json';
//import Associations from "../artifacts/contracts/humanitr/associations.sol/Associations.json";


const USDCAddr = "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43";
//const aUSDCAddr = "0x1Ee669290939f8a8864497Af3BC83728715265FF";
const vaultAddr = "0xfEfBE6428e002a034f40C57E60fb2F915620BD04";
//const yieldMaker = "0x33a5Ab044BC52f5f7693bdDA90FD681240d5F189";
//const associations = "0x44C1fA10E05Bc50E1a8EeCc74A386329Cb73e752";
const assoTest = "0x54C470f15f3f34043BB58d3FBB85685B39E33ed8"

export function SoulViewer () {
   const [ success, setSuccess ] = useState();
   const [ error, setError ] = useState();
   const [ waiting, setWaiting ] = useState();

   const [ soulSwitch, setSoulSwitch ] = useState(true);
   const [ balance, setBalance ] = useState();
   const [ balanceBN, setBalanceBN ] = useState();
   const [ transactionHash, setTransactionHash ] = useState();

   useEffect(() => {
      getBalance();
   }, [])

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
      //const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, provider);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, provider);
   await window.ethereum.request({method: 'eth_requestAccounts'});
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      try {
         let _overrides = {
            from: accounts[0]
         }
         const _balance = await vaultContract.getBalanceToken(USDCAddr, assoTest, _overrides);
         //setTransactionHash(_balance.hash);
         setBalanceBN(_balance);
         setBalance(bigNumToStr(_balance, 6, 2));
         console.log(balanceBN);
         console.log(balance);
      } catch(err) {
        console.log(err);
        ClearPopups();
        setError('erreur de getBalance');
      }
   }

   return(<div>
      <div>                     {/*------------- Popups --*/}
         {error && (<div>
            <div className='fullBlur'/>
            <button onClick={ClearPopups} className='popup-error'>{error}</button>
         </div>)}
         {success && (<div>
            <div className='fullBlur'/>
            <button onClick={ClearPopups} className='popup-success'>{success}</button>
         </div>)}
         {waiting && (<div>
            <button className='popup-waiting'>
               <div className="dot-elastic"></div>
               <a href={'https://goerli.etherscan.io/tx/'+transactionHash} className='pop-waiting-link' target='_blank' rel='noreferrer' >{waiting}</a>
            </button>
         </div>)}
      </div>
      {!soulSwitch && (<div className='box'>
         <div className="box-header-arrow" onClick={() => setSoulSwitch(!soulSwitch)}>
            <div>Behold your soul</div>
            <img src={downArrow} style={{height: '4vh'}} alt="down Arrow"/>
         </div>
      </div>)}
      {soulSwitch && (<div className='box'>
         <div className="box-header-arrow" onClick={() => setSoulSwitch(!soulSwitch)}>
            <div>Behold your soul</div>
            <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}} alt="down Arrow"/>
         </div>
         {balance}
         <input className='faucet-management-input' placeholder='enter amount'/* onChange={e => setAmount(e.target.value)}*//>
         <button className='faucet-default-button' /*onClick={e => {deposit()}}*/>Deposit</button>
         <button className='faucet-default-button' /*onClick={e => {withdrawAll()}}*/>Withdraw All</button>   
      </div>)}
   </div>)
}