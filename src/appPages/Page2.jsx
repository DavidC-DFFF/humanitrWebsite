import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AssetERC20 from '../../artifacts/contracts/assetERC20.sol/AssetERC20.json';
import Vault from '../../artifacts/contracts/vault.sol/Vault.json';
//import { ClearPopups } from '../Modules/popups.jsx';
import { Whitelisting } from '../Modules/Whitelisting';

let vaultAddress = "0x67799416315248E0d99420D0F34F0e84f8f429e2";
let jeurAddress = "0x150d9A8b8b5DCf72CFabE303DAD915BD72B31D00";

export function Page2 () {
  const [ success, setSuccess ] = useState();
  const [ error, setError ] = useState();
  const [ waiting, setWaiting ] = useState();
  const [ manage, setManage ] = useState('add');
  const [ asset, setAsset ] = useState(jeurAddress);
  const [ walletDeposit, setWalletDeposit ] = useState('0');
  const [ walletBalance, setWalletBalance ] = useState('0');
  const [ amount, setAmount ] = useState();
  const [ vaultLiquidity, setVaultLiquidity ] = useState();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manage]);
  function refresh () {
    getWalletDeposit();
    getWalletBalance();
    getVaultLiquidity();
  }
  function ClearPopups() {
    setError('');
    setSuccess('');
    setWaiting('');
  }
  function switchManagement () {
    if (manage === 'add') {
      setManage('withdraw');
    } else {
      setManage('add');
    }
  }
  async function deposit () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const assetContract = new ethers.Contract(jeurAddress, AssetERC20.abi, signer);
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, signer);
    try {
      setWaiting('Waiting for signature');
      const signature = await assetContract.approve(vaultAddress, amount);
      await signature.wait();
      setWaiting('Waiting for deposit');
      const withdraw = await vaultContract.depositTokens(amount, asset);
      await withdraw.wait();
      ClearPopups();
      setSuccess('Deposit done !');
      refresh();
    } catch(err) {
      console.log(err);
      ClearPopups();
      setError('erreur de deposit');
    }
  }
  async function depositAll () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const assetContract = new ethers.Contract(jeurAddress, AssetERC20.abi, signer);
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, signer);
    let accounts = await window.ethereum.request({method: 'eth_accounts'});
    try {
      setWaiting('Waiting for signature');
      const _totalAmount = await assetContract.balanceOf(accounts[0]);
      const signature = await assetContract.approve(vaultAddress, _totalAmount);
      await signature.wait();
      setWaiting('Waiting for deposit');
      const deposit = await vaultContract.depositAll(asset);
      await deposit.wait();
      ClearPopups();
      setSuccess('Deposit done !');
      refresh();
    } catch(err) {
      console.log(err);
      ClearPopups();
      setError('erreur de depositAll');
    }
  }
  async function withdraw () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, signer);
    try {
      setWaiting('Waiting for withdraw');
      const withdraw = await vaultContract.withdrawTokens(asset, amount);
      await withdraw.wait();
      ClearPopups();
      setSuccess('Withdraw done !');
      refresh();
    } catch(err) {
      console.log(err);
      ClearPopups();
      setError('erreur de withdraw');
    }
  }
  async function withdrawAll () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, signer);
    try {
      setWaiting('Waiting for withdraw');
      const withdraw = await vaultContract.withdrawAll(asset);
      await withdraw.wait();
      ClearPopups();
      setSuccess('Withdraw done !');
      refresh();
    } catch(err) {
      console.log(err);
      ClearPopups();
      setError('erreur de withdrawAll');
    }
  }
  async function getVaultLiquidity () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const assetContract = new ethers.Contract(jeurAddress, AssetERC20.abi, provider);
    try {
      const _totalAmount = await assetContract.balanceOf(vaultAddress);
      setVaultLiquidity(ethers.utils.commify(ethers.utils.formatUnits(_totalAmount, 18)));
    } catch(err) {
      console.log(err);
      ClearPopups();
      setError('erreur de getVault');
    }
  }
  async function getWalletDeposit () {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let accounts = await window.ethereum.request({method: 'eth_accounts'});
    const vaultContract = new ethers.Contract(vaultAddress, Vault.abi, provider);
    try {
      const _totalAmount = await vaultContract.getWalletBalance(accounts[0], jeurAddress);
      setWalletDeposit(ethers.utils.commify(ethers.utils.formatUnits(_totalAmount, 18)));
    } catch(err) {
      console.log(err);
      setError('Erreur de getWalletDeposit');
    }
  }
  async function getWalletBalance() {
    if (typeof window.ethereum == 'undefined') {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const assetContract = new ethers.Contract(jeurAddress, AssetERC20.abi, provider);
    let accounts = await window.ethereum.request({method: 'eth_accounts'});
    try {
      const _totalAmount = await assetContract.balanceOf(accounts[0]);
      setWalletBalance(ethers.utils.commify(ethers.utils.formatUnits(_totalAmount, 18)));
    } catch(err) {
      console.log(err);
      setError('Erreur, voir console.log');
    }
  }
  return (<div>
    {error && (<div>
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
  <div className='box'>                     {/*--- Funds manager --*/}
    <div className='box-header'>Funds manager</div>
    <div className='line'>
      <div className='item1'>Total deposit</div>
      <div className='item2'>{vaultLiquidity} jEUR</div>
    </div>
      
    <button style={{width: '17em'}} className='faucet-default-button' onClick={switchManagement}>Add / Withdraw switch</button>

    {(manage === 'add') && <div style={{width: '100%'}}>
      <div className='line'>
        <div className='item1'>On wallet :</div>
        <div className='item2'>{walletBalance} jEUR</div>
      </div>
      <div>
        <input className='faucet-management-input' placeholder='amount' onChange={e => setAmount(ethers.utils.parseUnits(e.target.value))}/>
      </div>
      <button className='faucet-default-button' onClick={deposit}>Deposit</button>
      <button className='faucet-default-button' onClick={depositAll}>Deposit all</button>
    </div>}
    {(manage === 'withdraw') && <div style={{width: '100%'}}>
      <div className='line'>
        <div className='item1'>Wallet deposit :</div>
        <div className='item2'>{walletDeposit} jEUR</div>
      </div>
      <div>
        <input className='faucet-management-input' placeholder='amount' onChange={e => setAmount(ethers.utils.parseUnits(e.target.value))}/>
      </div>
      <button className='faucet-default-button' onClick={withdraw}>Withdraw</button>
      <button className='faucet-default-button' onClick={withdrawAll}>Withdraw all</button>
    </div>}
  </div>
    <Whitelisting />
  </div>)
}