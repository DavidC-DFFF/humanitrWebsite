import { useState } from "react";
export function Tests() {
   const [currentAssetNameConfirmed, setCurrentAssetNameConfirmed] = useState("USDC");

   const [currentAsset, setCurrentAsset] = useState( /* Default asset */ { name: "USDC", token: "USDCAddr" });

   const assetArray = [
      { name: "USDC", token: "USDCAddr" },
      { name: "USDT", token: "USDTAddr" },
      { name: "DAI", token: "DAIAddr" }
   ];
   function setAsset() {
      for (let i = 0; i < assetArray.length; i++) {
         if (assetArray[i].name === currentAsset.name) {
            setCurrentAsset({
               name: assetArray[i].name,
               token: assetArray[i].token
            })
         }
      }
      setCurrentAssetNameConfirmed(currentAsset.name);
      getCurrentAsset();
   }
   function getCurrentAsset() {
      console.log(currentAsset);
   }
   return (<div>
      <form>
         <input
            type="input"
            list="assetsList"
            placeholder={currentAssetNameConfirmed}
            onChange={e => setCurrentAsset({name: e.target.value, token: ""})}
         />
         <datalist id="assetsList">
            {assetArray.map(
               (asset) => <option key={asset.token}>{asset.name}</option>)}
         </datalist>
      </form>
      <button onClick={setAsset}>Confirm</button>
      <button onClick={getCurrentAsset}>currentAsset</button>
   </div>)
}