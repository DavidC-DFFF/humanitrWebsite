import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { bigNumToStr, displayAddress } from "./commonFunctions";

import downArrow from '../img/downArrow.png';

export function BurnKRM() {
   const [success, setSuccess] = useState();
   const [error, setError] = useState();
   const [waiting, setWaiting] = useState();
   const [transactionHash, setTransactionHash] = useState();

   const [burnSwitch, setBurnSwitch] = useState(true);

   useEffect(() => {       // Chargement page
      // eslint-disable-next-line
   }, [])
   
   function ClearPopups() {
      setError('');
      setSuccess('');
      setWaiting('');
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
               Test
            </div>
         </div>)}
      </div>
   </div>)
}