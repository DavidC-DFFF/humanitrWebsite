import { useState/*, useEffect*/ } from "react";
import { ethers } from 'ethers';

import "./commonFunctions";
import downArrow from '../img/downArrow.png';

import AssetABI from '../artifacts/contracts/tools/usdc.sol/USDC.json';
import VaultABI from '../artifacts/contracts/humanitr/vault.sol/Vault.json';
//import ATokenABI from '../artifacts/contracts/aave/aToken.sol/AToken.json';
//import YieldMaker from '../artifacts/contracts/humanitr/yieldMaker-aave.sol/YieldMaker.dbg.json';
//import Associations from "../artifacts/contracts/humanitr/associations.sol/Associations.json";


const USDCAddr = "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43";
//const aUSDCAddr = "0x1Ee669290939f8a8864497Af3BC83728715265FF";
const vaultAddr = "0xfEfBE6428e002a034f40C57E60fb2F915620BD04";
//const yieldMaker = "0x33a5Ab044BC52f5f7693bdDA90FD681240d5F189";
//const associations = "0x44C1fA10E05Bc50E1a8EeCc74A386329Cb73e752";

export function ManageVault () {
   const [ success, setSuccess ] = useState();
   const [ error, setError ] = useState();
   const [ waiting, setWaiting ] = useState();

   const [ manageSwitch, setManageSwitch ] = useState(true);
   const [ amount, setAmount] = useState();
   const [ asset, setAsset ] = useState("0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43");
   const [ asso, setAsso ] = useState("0x54C470f15f3f34043BB58d3FBB85685B39E33ed8");
   const [ transactionHash, setTransactionHash ] = useState();


   function ClearPopups() {
      setError('');
      setSuccess('');
      setWaiting('');
   }

   async function deposit() {
      if (typeof window.ethereum == 'undefined') {
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
         const _deposit = await vaultContract.O1_deposit(asset, ethers.utils.parseUnits(amount, 6), asso);
         setWaiting('waiting for deposit');
         setTransactionHash(_deposit.hash);
         await _deposit.wait();
         ClearPopups();
         setSuccess('Deposit done !');
         //refresh();
      } catch(err) {
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
      console.log("before try");
      try {
         const _withdraw = await vaultContract.O3_withdrall(asset, asso);
         setWaiting('waiting for withdraw');
         setTransactionHash(_withdraw.hash);
         await _withdraw.wait();
         ClearPopups();
         setSuccess('Withdraw done !');
      } catch(err) {
         console.log(err);
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
      {!manageSwitch && (<div className='box'>
         <div className="box-header-arrow" onClick={() => setManageSwitch(!manageSwitch)}>
            <div>Manage your funds</div>
            <img src={downArrow} style={{height: '4vh'}} alt="down Arrow"/>
         </div>
      </div>)}
      {manageSwitch && (<div className='box'>
         <div className="box-header-arrow" onClick={() => setManageSwitch(!manageSwitch)}>
            <div>Manage your funds</div>
            <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}} alt="down Arrow"/>
         </div>
         <input className='faucet-management-input' placeholder='enter amount' onChange={e => setAmount(e.target.value)}/>
         <button className='faucet-default-button' onClick={e => {deposit()}}>Deposit</button>
         <button className='faucet-default-button' onClick={e => {withdrawAll()}}>Withdraw All</button>   
      </div>)}
   </div>)
}