import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import AssetERC20 from '../artifacts/contracts/assetERC20.sol/AssetERC20.json';
import UniswapV2Pair from '../artifacts/contracts/uniswapv2pair.sol/UniswapV2Pair.json';
import UniswapRouter from '../artifacts/contracts/uniswaprouter.sol/UniswapRouter.json';

let poolAddress = "0xdC3666bfa3fA213decde368c040d96232f0734d2";
let routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
let decimales = 5;

export function Uniswap () {
  const [ success, setSuccess ] = useState();
  const [ error, setError ] = useState();
  const [ waiting, setWaiting ] = useState();

  const token = {
    symbol: '',
    address: '',
    pooled: '',
    pooledBig: '',
    onWallet: '',
    onWalletBig: ''
  };
  const [ tokenA, setTokenA ] = useState(token);
  const [ tokenB, setTokenB ] = useState(token);
  const [ liquidityToken, setLiquidityToken ] = useState(token);

  const [ tokensOwned, setTokensOwned ] = useState();
  const [ tokensOwnedBig, setTokensOwnedBig ] = useState();
  const [ token1Symbol, setToken1Symbol ] = useState("None");
  const [ token2Symbol, setToken2Symbol ] = useState("None");
  const [ token1Pooled, setToken1Pooled ] = useState(0);
  const [ token2Pooled, setToken2Pooled ] = useState(0);
  const [ token1PooledBig, setToken1PooledBig ] = useState(0);
  const [ token2PooledBig, setToken2PooledBig ] = useState(0);
  const [ token1Address, setToken1Address ] = useState();
  const [ token2Address, setToken2Address ] = useState();
  const [ selectedAsset, setSelectedAsset ] = useState();
  const [ outputAssetSymbol, setOutputAssetSymbol ] = useState()
  const [ outputAssetAddress, setOutputAssetAddress] = useState();
  const [ amount, setAmount ] = useState(0);
  const [ amountToSwap, setAmountToSwap ] = useState(0);
  const [ amountSwapped, setAmountSwapped ] = useState(0);
  const [ amountSwappedDisplay, setAmountSwappedDisplay ] = useState(0);
  const [ transactionHash, setTransactionHash ] = useState();

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    syncOutputAmount();
  }, [amountToSwap]);

  function refresh() {
    getTokensOwned();
    getPair();
  }
  function ClearPopups() {
    setError('');
    setSuccess('');
    setWaiting('');
  }
  function bigNumToStr(_num) {
    let _amountRes = ethers.utils.formatEther(_num);
    return ((+_amountRes).toFixed(4));
  }
  async function getTokensOwned() {
    if (typeof window.ethereum == 'undefined') { return; }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const poolContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, provider);
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    try {
      const _amount = await poolContract.balanceOf(accounts[0]);
      setTokensOwnedBig(_amount);
      setTokensOwned(bigNumToStr(_amount));
    } catch(err) {
      console.log(err)
    }
  }
  async function depositOnPool() {
      if (typeof window.ethereum == 'undefined') { return; }
      getPair();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, signer);
      const token1Contract = new ethers.Contract(token1Address, AssetERC20.abi, signer);
      const token2Contract = new ethers.Contract(token2Address, AssetERC20.abi, signer);
      const pairContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, provider);
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const _amountA = ethers.utils.parseEther(amount);
      try {
        const _reserve = await pairContract.getReserves();
        const _amountB = await routerContract.quote(
          _amountA,
          _reserve[0],
          _reserve[1]);
        ClearPopups();
        const approve1 = await token1Contract.approve(routerAddress, _amountA);
        setTransactionHash(approve1.hash);
        setWaiting('Waiting for ' + token1Symbol + ' signature');
        await approve1.wait();
        const approve2 = await token2Contract.approve(routerAddress, _amountB);
        setTransactionHash(approve2.hash);
        setWaiting('Waiting for ' + token2Symbol + ' signature');
        await approve2.wait();
        ClearPopups();
        setWaiting('Waiting for deposit');
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000) + 600;
        console.log(_reserve[0], _reserve[1]);
        const _minAmountA = (_amountA.mul(99)).div(100);
        const _minAmountB = (_amountB.mul(99)).div(100);
        const _deposit = await routerContract.addLiquidity(
          token1Address, 
          token2Address, 
          _amountA, 
          _amountB, 
          _minAmountA,
          _minAmountB,
          accounts[0], 
          timestamp);
        setTransactionHash(_deposit.hash);
        await _deposit.wait();
        ClearPopups();
        setSuccess('Deposit done !!!');
        refresh();
      } catch(err) {
        ClearPopups();
        setError('Error depositOnPool');
        console.log(err);
      }
  }
  async function withdrawFromPool() {
    if (typeof window.ethereum == 'undefined') { return; }
      getPair();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, signer);
      const poolContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, signer);
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const _amount = ethers.utils.parseEther(amount);
    try {
        ClearPopups();
        setWaiting('Waiting for signature');
        const approve = await poolContract.approve(routerAddress, _amount);
        await approve.wait();
        ClearPopups();
        setWaiting('Waiting for transaction');
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000) + 600;
        const _withdraw = await routerContract.removeLiquidity(token1Address, token2Address, _amount, _amount, _amount, accounts[0], timestamp);
        await _withdraw.wait();
        ClearPopups();
        setSuccess('Deposit done !!!');
        refresh();
      } catch(err) {
        console.log(err);
        ClearPopups();
        setError('Error withdrawFromPool');
      }
  }
  async function withdrawAllFromPool() {
    if (typeof window.ethereum == 'undefined') { return; }
      getPair();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, signer);
      const poolContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, signer);
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    try {
        ClearPopups();
        setWaiting('Waiting for signature');
        const approve = await poolContract.approve(routerAddress, tokensOwnedBig);
        await approve.wait();
        ClearPopups();
        setWaiting('Waiting for transaction');
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000) + 600;
        const _withdraw = await routerContract.removeLiquidity(
          token1Address, 
          token2Address, 
          tokensOwnedBig, 
          (token1PooledBig.mul(99)).div(100), 
          (token2PooledBig.mul(99)).div(100), 
          accounts[0], 
          timestamp);
        await _withdraw.wait();
        ClearPopups();
        setSuccess('Withdraw done !!!');
        refresh();
      } catch(err) {
        console.log(err);
        ClearPopups();
        setError('Error withdrawAllFromPool');
      }
  }
  async function getPair() {
    if (typeof window.ethereum == 'undefined') { return; }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const poolContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, provider);
    try {
      const t1 = await poolContract.token0();
      setToken1Address(t1);
      setSelectedAsset(t1);
      const t1Contract = new ethers.Contract(t1, AssetERC20.abi, provider);
      const t1Symbol = await t1Contract.symbol();
      setToken1Symbol(t1Symbol);
      const t2 = await poolContract.token1();
      setToken2Address(t2);
      const t2Contract = new ethers.Contract(t2, AssetERC20.abi, provider);
      const t2Symbol = await t2Contract.symbol();
      setToken2Symbol(t2Symbol);
      setOutputAssetAddress(t2)
      setOutputAssetSymbol(t2Symbol);
      const r = await poolContract.getReserves();
      setToken1PooledBig(r[0]);
      setToken2PooledBig(r[1]);
      setToken1Pooled(bigNumToStr(r[0]));
      setToken2Pooled(bigNumToStr(r[1]));
    } catch(err) {
      console.log(err);
    }
  }
  async function syncOutputAmount() {
    if (typeof window.ethereum == 'undefined') { console.log("return noMetamask"); return; }
    if (amountToSwap == 0) { return; }
    if (amountToSwap == '') { return; }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, provider);
    try {
      let output = await routerContract.getAmountOut(amountToSwap, token2PooledBig, token1PooledBig);
      setAmountSwapped(output);
      output = bigNumToStr(output);
      setAmountSwappedDisplay(output);
    } catch(err) {
      ClearPopups();
      setError('Error syncOutputAmount');
      console.log(err);
    }
  }
  async function swap() {
    if (typeof window.ethereum == 'undefined') { return; }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, signer);
    const assetFromContract = new ethers.Contract(selectedAsset, AssetERC20.abi, signer);
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000) + 600;
    try {
      setWaiting('Waiting for signature');
      const signature = await assetFromContract.approve(routerAddress, amountToSwap);
      setTransactionHash(signature.hash);
      await signature.wait();
      setWaiting('Waiting for swap');
      const swapSuccessAmount = await routerContract.swapExactTokensForTokens(
        amountToSwap,
        (amountToSwap.mul(5)).div(10),
        [selectedAsset, outputAssetAddress],
        accounts[0],
        timestamp
      )
      setTransactionHash(swapSuccessAmount.hash);
      await swapSuccessAmount.wait();
      ClearPopups();
      setSuccess('Swap done');
      refresh();
    } catch(err) {
      ClearPopups();
      setError('Error in swap');
      console.log(err);
    }
  }
  return (
    <div>
{/*--------------------------------------------------------------*/}
      {error && (<div>                    {/*---------- Popups --*/}
        <div className='fullBlur'/>
        <button onClick={ClearPopups} className='popup-error'>{error}</button>
      </div>)}
      {success && (<div>
        <div className='fullBlur'/>
        <button onClick={ClearPopups} className='popup-success'><a href={'https://goerli.etherscan.io/tx/'+transactionHash} className='pop-waiting-link' target='_blank' rel='noreferrer' >{success}</a></button>
      </div>)}
      {waiting && (<div>
        <button className='popup-waiting'>
          <div className="dot-elastic"></div>
          <a href={'https://goerli.etherscan.io/tx/'+transactionHash} className='pop-waiting-link' target='_blank' rel='noreferrer' >{waiting}</a>
        </button>
      </div>)} 
{/*--------------------------------------------------------------*/}
      <div className='box'>
        <div className='box-header'>Uniswap pool</div>
        <div className='line'>
          <div className='item2'>Pool address</div>
          <div className='item2'><a href={'https://goerli.etherscan.io/address/'+poolAddress} target='_blank' rel='noreferrer' >{poolAddress.slice(0,(decimales+2))}...{poolAddress.slice(-decimales)}</a></div>
        </div>
        <div className='line'>
          <div className='item1'>
            Tokens owned
          </div>
          <div className='item2'>
            {tokensOwned}
          </div>
        </div>
        <div className='line'>
          <div className='item1'>
            {token1Symbol}
          </div>
          <div className='item2'>
            {token1Pooled}
          </div>
        </div>
        <div className='line'>
          <div className='item1'>
            {token2Symbol}
          </div>
          <div className='item2'>
            {token2Pooled}
          </div>
        </div>
        <input className='faucet-management-input' style={{width: '17em'}} placeholder='UNI-V2 amount' onChange={e => setAmount(e.target.value)}/>
        <div className="line">
          <button className='faucet-default-button' onClick={e => {depositOnPool()}}>Deposit</button>
          <button className='faucet-default-button' onClick={e => {withdrawFromPool()}}>Withdraw</button>
          <button className='faucet-default-button' onClick={e => {withdrawAllFromPool()}}>Withdraw All</button>
        </div>
      </div>
      <div className='box'>
        <div className='box-header'>Swaps</div>
        {(selectedAsset === token1Address) && (
          <div>
            <input className='faucet-management-input' style={{width: '17em'}} placeholder={token1Symbol+' amount'}  onChange={e => setAmountToSwap(ethers.utils.parseEther(e.target.value))}/>
            <div className='lineBy2'>
              <button className='faucet-asset-button-selected'>{token1Symbol}</button>
              <button className='faucet-asset-button-not-selected' onClick={() => {
                setSelectedAsset(token2Address);
                setOutputAssetSymbol(token1Symbol);
                setOutputAssetAddress(token1Address);
                setAmountToSwap(amountSwapped);
              }}>{token2Symbol}</button>
            </div>
          </div>)}
        {(selectedAsset === token2Address) && (
          <div>
            <input className='faucet-management-input' style={{width: '17em'}} placeholder={token2Symbol+' amount'} onChange={e => setAmountToSwap(ethers.utils.parseEther(e.target.value))}/>
            <div className='lineBy2'>
              <button className='faucet-asset-button-not-selected' onClick={() => {
                setSelectedAsset(token1Address);
                setOutputAssetSymbol(token2Symbol);
                setOutputAssetAddress(token2Address);
                setAmountToSwap(amountSwapped);
              }}>{token1Symbol}</button>
              <button className='faucet-asset-button-selected'>{token2Symbol}</button>
            </div>
        </div>)}
        <button className='faucet-default-button' style={{width: '17em'}} onClick={swap}>Swap for {amountSwappedDisplay} {outputAssetSymbol}</button>
      </div>
    </div>)
}