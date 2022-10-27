import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AssetERC20 from '../../artifacts/contracts/assetERC20.sol/AssetERC20.json';
import Vault from '../../artifacts/contracts/vault.sol/Vault.json';
import { ClearPopups } from '../../ComposantsJS/popups.js';
import { Uniswap } from '../Modules/Uniswap';
import { Sushiswap } from '../Modules/Sushiswap';

let vaultAddress = "0x67799416315248E0d99420D0F34F0e84f8f429e2";
let poolAddress = "0xdC3666bfa3fA213decde368c040d96232f0734d2";

export function Page3 () {
{/*------------------------------------------------------------------*/}
  const [ success, setSuccess ] = useState();
  const [ error, setError ] = useState();
  const [ waiting, setWaiting ] = useState();
  const [ tempToken, setTempToken ] = useState();
{/*------------------------------------------------------------------*/}
  let listSymbol = new Map();
{/*------------------------------------------------------------------*/}
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  function refresh () {
    getWhiteList();
  }
{/*------------------------------------------------------------------*/}
  async function addToWhiteList () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const _tokenAddress = tempToken;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, signer);
    try {
      setWaiting('waiting for adding');
      const addresses = await vaultContract.newToken(_tokenAddress);
      provider.on("pending", (tx) => {
        provider.getTransaction(tx).then(function (transaction) {
          console.log(transaction);
        });
    });
      await addresses.wait();
      ClearPopups();
      setSuccess('Adding done');
      refresh();
  } catch(err) {
      setError('already in whitelist');
    }
  }
  async function removeFromWhiteList () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const _tokenAddress = tempToken;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, signer);
    try {
      setWaiting('waiting for removing');
      const addresses = await vaultContract.deleteToken(_tokenAddress);
      await addresses.wait();
      setWaiting('');
      setSuccess('Removing done');
      refresh();
    } catch(err) {
      setError('error when remove');
    }
  }
  async function getWhiteList () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, provider);
    try {
      const liste = await vaultContract.callList();
      liste.forEach(adresse => listSymbol.set(adresse, getAssetSymbol(adresse)));
    } catch(err) {
      console.log(err);
    }
  }
{/*------------------------------------------------------------------*/}
  async function getAssetSymbol (_address) {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractToken = new ethers.Contract(_address, AssetERC20.abi, provider);
    try {
      const symbol = await contractToken.symbol();
      return symbol;
    } catch(err) {
      console.log(err);
    }
  }
{/*------------------------------------------------------------------*/}
  return (<div>
{/*------------------------------------------------------------------*/}
      {error && (<div>                        {/*---------- Popups --*/}
        <div className='fullBlur'/>
        <button onClick={ClearPopups} className='popup-error'>{error}</button>
      </div>)}
      {success && (<div>
        <div className='fullBlur'/>
        <button onClick={ClearPopups} className='popup-success'>{success}</button>
      </div>)}
      {waiting && (<div>
        <button className='popup-waiting'>
          <div className="dot-elastic"></div>
            {waiting}
        </button>
      </div>)}

      {/*<Uniswap />*/}
      <Sushiswap />
  </div>)}