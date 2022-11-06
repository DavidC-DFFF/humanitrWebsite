import { useState } from "react";
import { ethers } from 'ethers';

import DonatorsABI from "../artifacts/Donators.json";
import WhitelistABI from '../artifacts/Whitelist.json';
import AssociationsABI from '../artifacts/Associations.json';

// New contracts :
const donatorsAddr =       "0x89223Cbdf55CD439d660c5620d38E70292E0b26E";
const associationsAddr =   "0x3c75f343228d0637C1ee9c71664535001Dd03DFA";
const whitelistAddr =      "0x1726B80EFf863A4464eeae4da16d35916218B841";

export function TestArrayForDev() {
   const [donatorsList, setDonatorsList] = useState([]);
   const [assoList, setAssoList] = useState([]);
   const [assetList, setAssetList] = useState([]);
   /*async function getDonatorsList() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const donatorsContract = new ethers.Contract(donatorsAddr, DonatorsABI.abi, provider);
      try {
         let _list = await donatorsContract.getDonatorsList();
         setDonatorsList(_list);
         console.log(donatorsList);
      } catch (err) {
         console.log(err);
      }
   }*/
   async function getAssoList() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const AssociationsContract = new ethers.Contract(associationsAddr, AssociationsABI.abi, provider);
      try {
         setAssoList([]);
         let _length = await AssociationsContract.getAssoListLength();
         console.log("List length = " + _length);
         for (let i = 0 ; i < _length ; i++ ) {
            let _asso = await AssociationsContract.getAsso(i);
            setAssoList(oldasso => [...oldasso, _asso]);
         }
         console.log(assoList);
      } catch (err) {
         console.log(err);
      }
   }
   /*async function getAssetsList() {
      if (typeof window.ethereum == 'undefined') {
         return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const WhitelistContract = new ethers.Contract(whitelistAddr, WhitelistABI.abi, provider);
      try {
         setAssoList([]);
         let _length = await WhitelistContract.getAssetListLength();
         console.log("List length = " + _length);
         for (let i = 0 ; i < _length ; i++ ) {
            let _asset = await WhitelistContract.getAsset(i);
            setAssetList(oldasset => [...oldasset, _asset]);
         }
         console.log(assetList);
      } catch (err) {
         console.log(err);
      }
   }*/
   return (<div>
      <button onClick={getAssoList}>GetDonList</button>
      <button onClick={() => { console.log({assoList})}}>assos</button>
      <button onClick={() => { console.log(assoList)}}>Assos</button>
   </div>)
}