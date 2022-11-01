import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import downArrow from '../img/downArrow.png';
import { displayAddress } from "./commonFunctions";

//import Associations from "../artifacts/contracts/humanitr/associations.sol/Associations.json";
import Associations from "../artifacts/Associations.json";

const associationsAddr = "0x657bCfef5205191C422d5bEB251BCb98d2175fF2";  // Verified
const decimals = 4

export function TestList() {

   const [testSwitch, setTestSwitch] = useState(true);
   const [asso, setAsso] = useState(new Map());
   const [ assoName, setAssoName ] = useState([]);
   const [ assoWallet, setAssoWallet ] = useState([]);

   useEffect(() => {
   }, [])

   async function getAssoList() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const associationsContract = new ethers.Contract(associationsAddr, Associations.abi, provider);
      try {
         setAsso(new Map());
         var _length = await associationsContract.getAssoListLength();
         for (let i = 0; i < _length; i++) {
            var _asso = await associationsContract.Assos(i);
            console.log(_asso.name + " et " + _asso.wallet);
            console.log(_asso);
            setAsso(map => new Map(map.set(_asso.wallet, _asso.name)));
            console.log(asso);
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
            <li>{asso}</li>
            <div className="line"><button onClick={getAssoList}>Refresh</button></div>

         </div>)}
      </div>)
}