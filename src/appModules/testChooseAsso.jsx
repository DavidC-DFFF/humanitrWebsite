import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import downArrow from '../img/downArrow.png';
import { displayAddress } from "./commonFunctions";

import Associations from "../artifacts/Associations.json";

const associationsAddr = "0x1DFA8e5791113E5e2cC26b779791b7d75bBd0B0c";  // Verified
const decimals = 4

export function TestChooseAsso() {

   const [testSwitch, setTestSwitch] = useState(true);
   const [assos, setAssos] = useState([]);                 //tableau d'adresses
   const [ assoName, setAssoName ] = useState([]);
   const [ assoWallet, setAssoWallet ] = useState([]);

   useEffect(() => {
   }, [])

   async function getAssos() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const associationsContract = new ethers.Contract(associationsAddr, Associations.abi, provider);
      try {
         setAssoWallet([]);
         setAssoName([]);
         var _length = await associationsContract.getAssoListLength();
         console.log("_length = " + _length);
         for (let i = 0; i < _length; i++) {
            var _asso = await associationsContract.getAssoWallet(i);
            var _name = await associationsContract.getAssoName(i);

            console.log("i = " + i + " and _asso = " + _asso);
            console.log("i = " + i + " and _name = " + _name);
            setAssoWallet(prev => [...prev, _asso]);
            setAssoName(prev => [...prev, _name]);
         }
      } catch (err) {
         console.log(err);
      }
   }

   return (
      <div>  {!testSwitch && (<div className='box'>
         <div className="box-header-arrow" onClick={() => setTestSwitch(!testSwitch)}>
            <div>Test assos</div>
            <img src={downArrow} style={{ height: '4vh' }} alt="down Arrow" />
         </div>
      </div>)}
         {testSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setTestSwitch(!testSwitch)}>
               <div>Test assos</div>
               <img src={downArrow} style={{ height: '4vh', transform: 'rotate(180deg)' }} alt="down Arrow" />
            </div>
            {assoWallet.map((val, i) => 
            <li key={i} id={i}>{displayAddress(val, 4)}</li>)}
            {assoName.map((val, i) => 
            <li key={i} id={i}>{val}</li>)}
            <div className="line"><button onClick={getAssos}>Refresh</button></div>

         </div>)}
      </div>)
}