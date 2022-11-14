import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { bigNumToStr, displayAddress } from "./commonFunctions";
import KarmaABI from '../artifacts/Karma.json';

import downArrow from '../img/downArrow.png';

const karmaAddr =       "0x7D88900f025397a2E396A8887315c42b21020D62";

export function BurnKRM() {
   const [success, setSuccess] = useState();
   const [error, setError] = useState();
   const [waiting, setWaiting] = useState();

   const [transactionHash, setTransactionHash] = useState();
   const [targetWallet, setTargetWallet] = useState();
   const [target, setTarget] = useState('');
   const [karmaAmount, setKarmaAmount] = useState(0);
   const [burnAmount, setBurnAmount] = useState();

   const [burnSwitch, setBurnSwitch] = useState(true);
   const decimals = 4;

   useEffect(() => {       // Chargement page
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      readKarmaAmount();
   }, [target]);
   
   function ClearPopups() {
      setError('');
      setSuccess('');
      setWaiting('');
   }

   async function readKarmaAmount() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const karmaContract = new ethers.Contract(karmaAddr, KarmaABI.abi, provider);
      try {
         const _onWallet = await karmaContract.balanceOf(target);
         console.log(_onWallet);
         setKarmaAmount(_onWallet);
      } catch (err) {
         console.log(err);
      }
   }

   async function burn() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      if (karmaAmount < burnAmount) {
         setError('Not enough Karma to burn');
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const karmaContract = new ethers.Contract(karmaAddr, KarmaABI.abi, provider);
      try {

      } catch (err) {
         console.log(err);
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
      <div id="burn">
         {!burnSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setBurnSwitch(!burnSwitch)}>
               <div>Burn Karma</div>
               <img src={downArrow} style={{ height: '4vh' }} alt="down Arrow" />
            </div>
         </div>)}
         {burnSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setBurnSwitch(!burnSwitch)}>
               <div>Burn Karma</div>
               <img src={downArrow} style={{ height: '4vh', transform: 'rotate(180deg)' }} alt="down Arrow" />
            </div>

            <div className="line">
               <input className='input-default' placeholder='enter amount' style={{ width: "100%" }} onChange={e => setBurnAmount(ethers.utils.parseUnits(e.target.value, 6))} />
               <button className='button-default' onClick={burn}>Burn</button>
            </div>
            <div className="line">
               <input className='input-default' placeholder='enter target' style={{ width: "100%" }} onChange={e => setTargetWallet(e.target.value)} />
               <button className='button-default' onClick={() => {setTarget(targetWallet);}}>Read</button>
            </div>
            <div className="line">
               <div>Karma Owned</div>
               <div>{bigNumToStr(karmaAmount, 6, decimals)}</div>
            </div>
            <div className="line">
               <div>Target :</div>
               <div>{displayAddress(target, 5)}</div>
            </div>
         </div>)}
      </div>
   </div>)
}