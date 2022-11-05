import { useState, useEffect } from "react";

export function Tests() {
   const [currentAssetName, setCurrentAssetName] = useState();
   const [currentAssetNameConfirmed, setCurrentAssetNameConfirmed] = useState();

   const assetArray = [
      { name: "USDC", token: "USDCAddr"},
      { name: "USDT", token: "USDTAddr"},
      { name: "DAI", token: "DAIAddr"}
   ];
   var currentAsset = {
      name: "USDC",
      token: "USDCAddr"
   };

   useEffect(() => {       // Chargement page
      setCurrentAssetNameConfirmed(currentAsset.name);
      // eslint-disable-next-line
   }, [])

   function setCurrentAsset() {
      for (let i = 0; i < assetArray.length; i++) {
         if (assetArray[i].name == currentAssetName) {
            currentAsset = {
               name: assetArray[i].name,
               token: assetArray[i].token
            };
         }
      }
      setCurrentAssetNameConfirmed(currentAsset.name);
      console.log(currentAsset)
   }
   function getCurrentAsset() {
      console.log(currentAsset);
   }
   return (<div>
      <div id="cleanse">
         <form>
            <input type="input" list="assetsList" placeholder={currentAssetNameConfirmed} onChange={e => setCurrentAssetName(e.target.value)} />
            <datalist id="assetsList">
               {assetArray.map(
                  (asset) => <option key={asset.token}>{asset.name}</option>)}
            </datalist>
         </form>
         <button onClick={setCurrentAsset}>Confirm</button>
         <button onClick={getCurrentAsset}>currentAsset</button>
      </div>
   </div>)
}