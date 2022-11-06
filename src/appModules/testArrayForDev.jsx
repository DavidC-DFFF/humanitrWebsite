import { useState } from "react";

const USDCAddr =        "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43";
const aUSDCAddr =       "0x1Ee669290939f8a8864497Af3BC83728715265FF";
const USDTAddr =        "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49";
const aUSDTAddr =       "0x73258E6fb96ecAc8a979826d503B45803a382d68";
const DAIAddr =         "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464";
const aDAIAddr =        "0x310839bE20Fc6a8A89f33A59C7D5fC651365068f";

export function Tests() {
   const [currentAsset, setCurrentAsset] = useState({ 
      name: "USDC", 
      token: USDCAddr,
      aToken: aUSDCAddr });
   const [currentAssetNameConfirmed, setCurrentAssetNameConfirmed] = useState("USDC");
   
   const [currentAsso, setCurrentAsso] = useState({
      name: "Dev",
      wallet: "0x14B059c26a99a4dB9d1240B97D7bCEb7C5a7eE13" });
   const [currentAssoNameConfirmed, setCurrentAssoNameConfirmed] = useState("Dev");

   const assetArray = [
      { name: "USDC", token: USDCAddr, aToken: aUSDCAddr},
      { name: "USDT", token: USDTAddr, aToken: aUSDTAddr },
      { name: "DAI", token: DAIAddr, aToken: aDAIAddr }
   ];
   const assoArray = [
      { name: "dev", wallet: "0x14B059c26a99a4dB9d1240B97D7bCEb7C5a7eE13" },
      { name: "Autism Reasearch Institute", wallet: "0xCbBB5002A10aAE351E6B77AA81757CC492A18E3F" },
      { name: "Asso test", wallet: "0x54C470f15f3f34043BB58d3FBB85685B39E33ed8" }
   ];
   function setAsset() {
      for (let i = 0; i < assetArray.length; i++) {
         if (assetArray[i].name === currentAsset.name) {
            setCurrentAsset({
               name: assetArray[i].name,
               token: assetArray[i].token,
               aToken: assetArray[i].aToken
            })
         }
      }
      setCurrentAssetNameConfirmed(currentAsset.name);
      getCurrentAsset();
   }
   function setAsso() {
      for (let i = 0; i < assetArray.length; i++) {
         if (assoArray[i].name === currentAsso.name) {
            setCurrentAsso({
               name: assoArray[i].name,
               token: assoArray[i].wallet
            })
         }
      }
      setCurrentAssoNameConfirmed(currentAsset.name);
      getCurrentAsso();
   }
   function getCurrentAsset() {
      console.log(currentAsset);
   }
   function getCurrentAsso() {
      console.log(currentAsso);
   }
   return (<div>
      <div>
         <form>
            <input
               type="input"
               list="assetsList"
               placeholder={currentAssetNameConfirmed}
               onChange={e => setCurrentAsset({name: e.target.value, token: "", aToken: ""})}
            />
            <datalist id="assetsList">
               {assetArray.map(
                  (asset) => <option key={asset.id}>{asset.name}</option>)}
            </datalist>
         </form>
         <button onClick={setAsset}>Confirm</button>
         <button onClick={getCurrentAsset}>currentAsset</button>
      </div>
      <div>
         <form>
            <input
               type="input"
               list="assosList"
               placeholder={currentAssoNameConfirmed}
               onChange={e => setCurrentAsso({name: e.target.value, wallet: ""})}
            />
            <datalist id="assosList">
               {assoArray.map(
                  (asso) => <option key={asso.id}>{asso.name}</option>)}
            </datalist>
         </form>
         <button onClick={setAsso}>Confirm</button>
         <button onClick={getCurrentAsso}>currentAsso</button>
      </div>
   </div>)
}