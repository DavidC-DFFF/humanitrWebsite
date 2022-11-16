import { useState, useEffect, useRef } from "react";
import { ethers } from 'ethers';
import QRCode from "qrcode";

import downArrow from '../img/downArrow.png';

export function QrCode() {

   const [wallet, setWallet] = useState('');

   const [qrSwitch, setQrSwitch] = useState(true);
   const canvasRef = useRef();

   useEffect(() => {       // Chargement page
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      QRCode.toCanvas(
        canvasRef.current,
        // QR code doesn't work with an empty string
        // so we are using a blank space as a fallback
        wallet || " ",
        (error) => error && console.error(error)
      );
    }, [wallet]);
    useEffect(() => {
       if (window.ethereum) {
          window.ethereum.on("chainChanged", () => {
             window.location.reload();
          });
          window.ethereum.on("accountsChanged", () => {
             window.location.reload();
          });
       }
       getConnectStatus();
    }, [])

   async function getConnectStatus() {
      let accounts = await window.ethereum.request({ method: 'eth_accounts' });
      accounts = ethers.utils.getAddress(accounts[0]);
      if (accounts[0] && accounts[0].length > 0) {
         setWallet(accounts);
      } else {
         setWallet('');
      }
   }

   return (<div>
      <div id="qrCode">
         {!qrSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setQrSwitch(!qrSwitch)}>
               <div>Wallet</div>
               <img src={downArrow} style={{ height: '4vh' }} alt="down Arrow" />
            </div>
         </div>)}
         {qrSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setQrSwitch(!qrSwitch)}>
               <div>Wallet</div>
               <img src={downArrow} style={{ height: '4vh', transform: 'rotate(180deg)' }} alt="down Arrow" />
            </div>
               <canvas ref={canvasRef} />
         </div>)}
      </div>
   </div>)
}