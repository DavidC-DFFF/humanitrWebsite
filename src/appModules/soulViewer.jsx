import { useEffect, useState/*, useEffect*/ } from "react";
import { ethers } from 'ethers';

import "./commonFunctions";
import "./manageVault";
import downArrow from '../img/downArrow.png';

import      VaultABI       from '../artifacts/contracts/humanitr/vault.sol/Vault.json';
import   { bigNumToStr }   from "./commonFunctions";
import      Associations   from "../artifacts/contracts/humanitr/associations.sol/Associations.json";
//import    YieldMaker     from '../artifacts/contracts/humanitr/yieldMaker-aave.sol/YieldMaker.dbg.json';
//import    AssetABI       from '../artifacts/contracts/tools/usdc.sol/USDC.json';


const USDCAddr          =  "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43";
const vaultAddr         =  "0xfEfBE6428e002a034f40C57E60fb2F915620BD04";
const assoTest          =  "0x54C470f15f3f34043BB58d3FBB85685B39E33ed8";
const associationsAddr  =  "0xbD34c0f5a1fB46ae0eC04Dd5Bc737a58470364cA";
// const associationsAddr  =  "0x44C1fA10E05Bc50E1a8EeCc74A386329Cb73e752"; // old address
// const yieldMaker        =  "0x33a5Ab044BC52f5f7693bdDA90FD681240d5F189";
// const aUSDCAddr         =  "0x1Ee669290939f8a8864497Af3BC83728715265FF";

export function SoulViewer() {
   const [ success, setSuccess ] = useState();
   const [ error, setError ] = useState();
   const [ waiting, setWaiting ] = useState();

   const [ soulSwitch      ,  setSoulSwitch     ] = useState(true);
   const [ balance         ,  setBalance        ] = useState();
   // eslint-disable-next-line
   const [ balanceBN       ,  setBalanceBN      ] = useState();
   const [ donations       ,  setDonations      ] = useState();
   const [ fullDonations   ,  setFullDonations  ] = useState();

   useEffect(() => {
      refresh();
      // eslint-disable-next-line
   }, [])

   function ClearPopups() {
      setError('');
      setSuccess('');
      setWaiting('');
   }
   function refresh() {
      getBalance();
      getDonations();
      getTotalDonations()
   }
   async function getBalance() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, provider);
      const vaultContract = new ethers.Contract(vaultAddr, VaultABI.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _overrides = {
            from: accounts[0]
         }
         let _balance = await vaultContract.getBalanceToken(USDCAddr, assoTest, _overrides);
         setBalanceBN(_balance);
         _balance = bigNumToStr(_balance, 6, 2);
         setBalance(_balance);
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
      //const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, provider);
      const associationsContract = new ethers.Contract(associationsAddr, Associations.abi, provider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
         let _donations = await associationsContract.getUserDonation(accounts[0], assoTest);
         _donations = bigNumToStr(_donations, 6, 2);
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
      //const assetContract = new ethers.Contract(USDCAddr, AssetABI.abi, provider);
      const associationsContract = new ethers.Contract(associationsAddr, Associations.abi, provider);
      try {
         let _donations = await associationsContract.getFullDonation();
         _donations = bigNumToStr(_donations, 6, 2);
         setFullDonations(_donations);
      } catch (err) {
         console.log(err);
         ClearPopups();
         setError('erreur de getBalance');
      }
   }
   return (<div>
      <div>
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
               <div className="dot-elastic"></div>{waiting}
            </button>
         </div>)}
      </div>
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
         <div>Deposits : {balance}</div>
         <div>Donated : {donations}</div>
         <div className="box-footer">Total Donations : {fullDonations}</div>
      </div>)}
   </div>)
}