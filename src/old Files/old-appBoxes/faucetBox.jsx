import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import downArrow from '../../img/downArrow.png';

import JEUR from '../../artifacts/contracts/jeur.sol/JEUR.json';
import EURS from '../../artifacts/contracts/eurs.sol/EURS.json';
import Faucet from '../../artifacts/contracts/faucet.sol/Faucet.json';

//Adresses sur le testnet Goerli
let jeurAddress = "0x150d9A8b8b5DCf72CFabE303DAD915BD72B31D00";
let eursAddress = "0xC1B34a591C935156C7AAE685Eb68C6d7980a98FD";
let faucetAddress = "0xd7E83ea1f38f174639A8e58Df139cE89fDBE9B07";

export function Faucets () {

  const [ claimSwitch, setClaimSwitch ] = useState(false);
  const [ faucetSwitch, setFaucetSwitch ] = useState(false);
  
    const [ value, setValue ] = useState();
    const [ error, setError ] = useState('');
    const [ success, setSuccess ] = useState('');
    const [ waiting, setWaiting ] = useState('');
    const [ state, setState ] = useState();
    const [ rpc, setRpc ] = useState();
    const [ jeurOnWallet, setJeurOnWallet ] = useState(0);
    const [ eursOnWallet, setEursOnWallet ] = useState(0);
    const [ tokenAmount, setTokenAmount ] = useState(0);
    const [ asset, setAsset ] = useState(eursAddress);
    const [ assetSymbol, setAssetSymbol ] = useState('EURs');
    const [ connectedWallet, setConnectedWallet ] = useState();
    const [ ownerConnected, setOwnerConnected ] = useState("false");


/*---- Rafraîchit si changement de wallet ou de RPC ------------*/
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    getRPC();
    getConnectStatus();
  }, [])
/*---- Vérifie le statut de connexion --------------------------*/
  async function getConnectStatus() {
    let accounts = await window.ethereum.request({method: 'eth_accounts'});
    accounts = ethers.utils.getAddress(accounts[0]);
    if(accounts[0] && accounts[0].length > 0) {
      setConnectedWallet(accounts);
      setState(accounts.slice(0, 6) + "..." + accounts.slice(-5));
    } else {
      setState();
    }
  }
/*---- Vérifie le RPC (ici Goerli) -----------------------------*/
  async function getRPC() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x5') {
      setRpc(1);
    }
  }
/*-----------------------------------------------------*/
/*----- Rafraîchir les wallets et le faucet -----------*/
  function refresh() {
    getFaucetAmount(asset);
    getJeurOnWallet();
    getEursOnWallet();
  }
/*-----------------------------------------------------*/
/*----- Faucet ----------------------------------------*/
  async function claimFaucet(_tokenAddress) {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractFaucet = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    const maxWithdraw = await getFaucetAmount(_tokenAddress);
    try {
      if (maxWithdraw < (100 * 10**18)) {
        console.log("Not enough funds");
        setError("Not enough funds");
        return;
      }
      setWaiting('Waiting for claiming');
      let data = await contractFaucet.claim(_tokenAddress);
      await data.wait();
      clearWaiting();
      setSuccess('You claimed with success');
      refresh();
    } catch(err) {
      setError('You cannot claim more for now');
    }
  }
  async function depositToFaucet() {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const assetContract = new ethers.Contract(asset, EURS.abi, signer);
    const faucetContract = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    try {
      setWaiting('waiting for signature');
      const signature = await assetContract.approve(faucetAddress, ethers.utils.parseUnits(value, 18));
      await signature.wait();
      setWaiting('waiting for transaction')
      const deposit = await faucetContract.refill(asset, ethers.utils.parseUnits(value, 18));
      await deposit.wait();
      clearWaiting();
      setSuccess('Deposit done !');
      refresh();
    } catch(err) {
      console.log(err);
    }
  }
  async function withdrawFromFaucet() {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const faucetContract = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    try {
      setWaiting('Waiting for transaction');
      const withdraw = await faucetContract.withdraw(asset, ethers.utils.parseUnits(value, 18));
      await withdraw.wait();
      clearWaiting();
      setSuccess('Withdraw done !');
      refresh();
    } catch(err) {
      console.log(err);
    }

  }
  async function withdrawAllFromFaucet(){
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const assetContract = new ethers.Contract(asset, EURS.abi, signer);
    const faucetContract = new ethers.Contract(faucetAddress, Faucet.abi, signer);
    try {
      setWaiting('Waiting for withdraw');
      const _amount = await assetContract.balanceOf(faucetAddress);
      const withdraw = await faucetContract.withdraw(asset, _amount);
      await withdraw.wait();
      clearWaiting();
      setSuccess('Withdraw done !');
      refresh();
    } catch(err) {
      console.log(err);
    }
  }
  async function getFaucetAmount(_tokenAddress) {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(_tokenAddress, JEUR.abi, provider);
    try {
      let data = await contract.balanceOf(faucetAddress);
      setTokenAmount(ethers.utils.formatUnits(String(data), 18));
      return data;
    } catch(err) {
      console.log(err);
    }
  }
/*-----------------------------------------------------*/
/*----- Lire les wallets et le faucet -----------------*/
async function getEursOnWallet() {
  if (typeof window.ethereum == 'undefined') {
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(eursAddress, EURS.abi, provider);
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
  try {
    let data = await contract.balanceOf(accounts[0]);
    setEursOnWallet(ethers.utils.formatUnits(data, 18));
  } catch(err) {
    console.log(err);
  }
}
async function getJeurOnWallet() {
  if (typeof window.ethereum == 'undefined') {
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(jeurAddress, JEUR.abi, provider);
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
  try {
    let data = await contract.balanceOf(accounts[0]);
    setJeurOnWallet(ethers.utils.formatUnits(data, 18));
  } catch(err) {
    console.log(err);
  }
}
/*-----------------------------------------------------*/
/*----- Effacer les erreurs ---------------------------*/
  function clearError() {
    setError('');
  }
  function clearSuccess() {
    setSuccess('');
  }
  function clearWaiting() {
    setWaiting('');
  }

  return (
    <div>       
      <div>         {/*---- Claim faucet ---------------------------------*/}
        {!claimSwitch && (<div className='box'>
              <div className='box-header-arrow'>
                <div>Claim !</div>
                <img src={downArrow} style={{height: '4vh'}}  onClick={() => setClaimSwitch(!claimSwitch)}/>
              </div>
          </div>
        )}
        {claimSwitch && (<div className='box'>
              <div className='box-header-arrow'>
                <div>Claim !</div>
                <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}}  onClick={() => setClaimSwitch(!claimSwitch)}/>
              </div>
              <div className='line'>
                <div className='item'>
                  <button className='faucet-default-button' onClick={e => {claimFaucet(eursAddress)}}>{ethers.utils.commify(100)} EURs</button>
                </div>
                <div className='item'>
                  <button className='faucet-default-button' onClick={e => {claimFaucet(jeurAddress)}}>{ethers.utils.commify(100)} jEUR</button>
                </div>
              </div>
          </div>
        )}
      </div>
      <div>         {/*---- Owner deposits faucet ------------------------*/}
        {!faucetSwitch && (
          <div className='box'>
            <div className='box-header-arrow'>
              <div>Faucet management</div>
              <img src={downArrow} style={{height: '4vh'}}  onClick={() => setFaucetSwitch(!faucetSwitch)}/>
            </div>
          </div>
        )}
        {faucetSwitch && (<div>
          <div className='box'>
            <div className='box-header-arrow'>
              <div>Faucet management</div>
              <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}}  onClick={() => setFaucetSwitch(!faucetSwitch)}/>
            </div>
            <div className='line'>
              <div className='column'>
                {(assetSymbol === "EURs") &&
                <button className='faucet-asset-button-selected' onClick={e => {setAsset(eursAddress)}}>EURs</button>}
                {(assetSymbol !== "EURs") &&
                <button className='faucet-asset-button-not-selected' onClick={e => {setAsset(eursAddress)}}>EURs</button>}
              </div>
              <div className='column'>
                {(assetSymbol === "jEUR") &&
                <button className='faucet-asset-button-selected' onClick={e => {setAsset(jeurAddress)}}>jEUR</button>}
                {(assetSymbol !== "jEUR") &&
                <button className='faucet-asset-button-not-selected' onClick={e => {setAsset(jeurAddress)}}>jEUR</button>}
              </div>
            </div>
            <div className='line'>
              {(ownerConnected === "false") && <div className='faucet-restriction'>Access restricted to owner</div>}
              <div className='column'>
                <input className='faucet-management-input' placeholder='enter amount' onChange={e => setValue(e.target.value)}/>
                <button className='faucet-default-button' onClick={e => {depositToFaucet()}}>Deposit</button>
              </div>
              <div className='column'>
                <button className='faucet-default-button' onClick={e => {withdrawFromFaucet()}}>Withdraw</button>
                <button className='faucet-default-button' onClick={e => {withdrawAllFromFaucet()}}>Withdraw all</button>
              </div>
            </div>
            <div className='box-footer'>
              <div className='line'>
                <div>Faucet liquidity</div>
                <div>{ethers.utils.commify(tokenAmount)} {assetSymbol}</div>
              </div>
            </div>
          </div>
        </div>)}
      </div>
    </div>)
}