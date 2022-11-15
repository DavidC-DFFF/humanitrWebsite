import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

import downArrow from '../img/downArrow.png';

export function QrCode() {

   const [wallet, setWallet] = useState('');
   const [toQr, setToQr] = useState('');

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

   function valid() {
      setToQr({wallet});
   }

   return (<div>
      <div id="qrCode">
         {!qrSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setQrSwitch(!qrSwitch)}>
               <div>QR code generator</div>
               <img src={downArrow} style={{ height: '4vh' }} alt="down Arrow" />
            </div>
         </div>)}
         {qrSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setQrSwitch(!qrSwitch)}>
               <div>QR code generator</div>
               <img src={downArrow} style={{ height: '4vh', transform: 'rotate(180deg)' }} alt="down Arrow" />
            </div>

            <div className="line">
               <input className='input-default' placeholder='enter text' style={{ width: "100%" }} onChange={e => setWallet(e.target.value)} />
               <button className='button-default' onClick={valid}>Valid</button>
            </div>
            <canvas ref={canvasRef} />
         </div>)}
      </div>
   </div>)
}