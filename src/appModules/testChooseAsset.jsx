import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import downArrow from '../img/downArrow.png';
import { displayAddress } from "./commonFunctions";

import WhitelistABI from "../artifacts/Whitelist.json";

const whitelistAddr = "0x056aEdc16b2DD3E2A43f8809983870b9bfFFA358";

export function TestChooseAsset() {

   const [testSwitch, setTestSwitch] = useState(true);
   const [asset, setAsset] = useState([]);/*
      {
         _index: '',
         _name: '',
         _tokenAddress: '',
         _aTokenAddress: ''
      }
   ]);*/
   const [assetName, setAssetName] = useState([]);
   /*const [assetAddress, setAssetAddress] = useState([]);
   const [aaveAssetAddress, setAaveAssetAddress] = useState([]);*/
   const [currentAsset, setCurrentAsset] = useState();/*
      {
         _index: '',
         _name: '',
         _tokenAddress: '',
         _aTokenAddress: ''
      });*/

   async function getAssets() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const whitelistContract = new ethers.Contract(whitelistAddr, WhitelistABI.abi, provider);
      try {
         setAsset([]);
         setAssetName([]);/*
         setAssetAddress([]);
         setAaveAssetAddress([]);*/
         var _length = await whitelistContract.getAssetListLength();
         console.log("_length = " + _length);
         for (let i = 0; i < _length; i++) {
            var _name = await whitelistContract.getAssetName(i);
            var _token = await whitelistContract.getAssetAddress(i);
            var _aToken = await whitelistContract.getAaveAssetAddress(i);
            setAssetName(prev => [...prev, _name]);
/*            setAssetAddress(prev => [...prev, _token]);
            setAaveAssetAddress(prev => [...prev, _aToken]);
            console.log("index : " + i + ", name : " + _name + ", token : " + _token + " and aToken : " + _aToken);*/
            setAsset(prev => [...prev, { _name, _token, _aToken }]);
            console.log({ asset });
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
            <div className="line">
               <label htmlFor="asset-choice">Asset :</label>
               <input list="Asset" id="asset-choice" name="asset-choice" onChange={e => setCurrentAsset(e.target.value)} />
               <datalist id="Asset">
                  {assetName.map((val, i) =>
                     <option key={i} id={i}>{val}</option>)}
               </datalist>
            </div>
            <div className="line"><button onClick={getAssets}>Refresh</button></div>
            {asset.map((_asset, index) => {
               return (
                  <div className='line' key={index}>
                     <div>{_asset._name}</div>
                     <div>{displayAddress(_asset._token, 4)}</div>
                     <div>{displayAddress(_asset._aToken, 4)}</div>
                  </div>
               )
            })}
         </div>)}
      </div>)
}