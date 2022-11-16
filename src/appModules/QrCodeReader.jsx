import { useEffect } from "react";
import { useState } from "react";
import { QrReader } from 'react-qr-reader';

export function QrCodeReader() {
   const [wallet, setWallet] = useState('No result');

   useEffect(() => {
      console.log(wallet);
   }, [wallet])

   return (<div>
      <div id="qrCodeReader">
         <QrReader onResult={(result, error) => {
            if (!!result) {
               setWallet(result?.text);
            }

            if (!!error) {
               console.info(error);
            }
         }} style={{ width: '100%' }} />
         <p>{wallet}</p>
      </div>
   </div>)
}