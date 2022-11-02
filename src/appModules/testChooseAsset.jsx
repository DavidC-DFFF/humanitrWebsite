import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import downArrow from '../img/downArrow.png';
import { displayAddress } from "./commonFunctions";

import Associations from "../artifacts/Associations.json";
import WhitelistABI from "../artifacts/Whitelist.json";

const associationsAddr = "0x1DFA8e5791113E5e2cC26b779791b7d75bBd0B0c";  // Verified
const whitelistAddr = "0x056aEdc16b2DD3E2A43f8809983870b9bfFFA358";

export function TestChooseAsset() {

   const [testSwitch, setTestSwitch] = useState(true);
   //const [assos, setAssos] = useState([]);                 //tableau d'adresses
   const [ assetName, setAssetName ] = useState([]);
   const [ assetAddress, setAssetAddress ] = useState([]);
   const [ aaveAssetAddress, setAaveAssetAddress ] = useState([]);

   useEffect(() => {
   }, [])

   async function getAssets() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const whitelistContract = new ethers.Contract(whitelistAddr, WhitelistABI.abi, provider);
      try {
         setAssetName([]);
         setAssetAddress([]);
         setAaveAssetAddress([]);
         var _length = await whitelistContract.getAssetListLength();
         console.log("_length = " + _length);
         for (let i = 0; i < _length; i++) {
            var _name = await whitelistContract.getAssetName(i);
            var _token = await whitelistContract.getAssetAddress(i);
            var _aToken = await whitelistContract.getAaveAssetAddress(i);

            console.log("i = " + i + " and _name = " + _name);
            console.log("i = " + i + " and _token = " + _token);
            console.log("i = " + i + " and _aToken = " + _aToken);
            setAssetName(prev => [...prev, _name]);
            setAssetAddress(prev => [...prev, _token]);
            setAaveAssetAddress(prev => [...prev, _aToken]);
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
            {assetName.map((val, i) => 
            <li key={i} id={i}>{val}</li>)}
            {assetAddress.map((val, i) => 
            <li key={i} id={i}>{displayAddress(val,5)}</li>)}
            {aaveAssetAddress.map((val, i) => 
            <li key={i} id={i}>{displayAddress(val,5)}</li>)}
            <div className="line"><button onClick={getAssets}>Refresh</button></div>

         </div>)}
      </div>)
}