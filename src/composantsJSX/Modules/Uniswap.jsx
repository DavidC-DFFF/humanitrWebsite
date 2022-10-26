import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import AssetERC20 from '../../artifacts/contracts/assetERC20.sol/AssetERC20.json';
import UniswapV2Pair from '../../artifacts/contracts/uniswapv2pair.sol/UniswapV2Pair.json';
import UniswapRouter from '../../artifacts/contracts/uniswaprouter.sol/UniswapRouter.json';

let poolAddress = "0xdC3666bfa3fA213decde368c040d96232f0734d2";
let routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
let decimales = 5;

export function Uniswap () {
  const [ success, setSuccess ] = useState();
  const [ error, setError ] = useState();
  const [ waiting, setWaiting ] = useState();

  const token = {
    symbol: '',
    contractAddress: '',
    pooled: 0,
    pooledBig: 0,
    onWallet: 0,
    onWalletBig: 0
  };

  const [ tokenA, setTokenA ] = useState(token);
  const [ tokenB, setTokenB ] = useState(token);
  const [ liquidityToken, setLiquidityToken ] = useState(token);
  const [ inToken, setInToken ] = useState(token);
  const [ outToken, setOutToken ] = useState(token);
  const [ inTokenAmount, setInTokenAmount ] = useState();
  const [ outTokenAmount, setOutTokenAmount ] = useState([]);

  const [ amount, setAmount ] = useState(0);
  
  const [ amountToSwap, setAmountToSwap ] = useState(0);
  const [ amountSwapped, setAmountSwapped ] = useState(0);
  const [ amountSwappedDisplay, setAmountSwappedDisplay ] = useState(0);

  const [ transactionHash, setTransactionHash ] = useState();

  useEffect(() => {
    console.log('Init in 5 seconds');
    wait();
    getPoolUpdate();
    setInToken(tokenA);
    setOutToken(tokenB);
    getPoolUpdate();
  }, []);

  useEffect(() => {

  }, [tokenA, tokenB, liquidityToken, inToken, outToken, inTokenAmount, outTokenAmount[0]])

  useEffect(() => {
    syncOutputAmount();
  }, [inTokenAmount, outTokenAmount[0]]);

  async function wait() {
    await new Promise(r => setTimeout(r, 5000));
  }

  function refresh() {
    getPoolUpdate();
    //getPair();
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
  async function getPoolUpdate() {
    if (typeof window.ethereum == 'undefined') { return; }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const poolContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, provider);
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    try {
      let _symbol = await poolContract.symbol();
      await new Promise(r => setTimeout(r, 100));
      let _address = poolAddress;
      let _pooledBig = await poolContract.totalSupply();
      await new Promise(r => setTimeout(r, 100));
      let _pooled = bigNumToStr(_pooledBig);
      let _onWalletBig = await poolContract.balanceOf(accounts[0]);
      await new Promise(r => setTimeout(r, 100));
      let _onWallet = bigNumToStr(_onWalletBig);
      setLiquidityToken({
        symbol: _symbol,
        contractAddress: _address,
        pooled: _pooled,
        pooledBig: _pooledBig,
        onWallet: _onWallet,
        onWalletBig: _onWalletBig});
      console.log(liquidityToken);
      _address = await poolContract.token0();
      await new Promise(r => setTimeout(r, 100));
      const tokenAContract = new ethers.Contract(_address, UniswapV2Pair.abi, provider);
      _symbol = await tokenAContract.symbol();
      await new Promise(r => setTimeout(r, 100));
      _pooledBig = await tokenAContract.balanceOf(poolAddress);
      await new Promise(r => setTimeout(r, 100));
      _pooled = bigNumToStr(_pooledBig);
      _onWalletBig = await tokenAContract.balanceOf(accounts[0]);
      await new Promise(r => setTimeout(r, 100));
      _onWallet = bigNumToStr(_onWalletBig);
      setTokenA({
        symbol: _symbol,
        contractAddress: _address,
        pooled: _pooled,
        pooledBig: _pooledBig,
        onWallet: _onWallet,
        onWalletBig: _onWalletBig});
      console.log(tokenA);
      _address = await poolContract.token1();
      await new Promise(r => setTimeout(r, 100));
      const tokenBContract = new ethers.Contract(_address, UniswapV2Pair.abi, provider);
      _symbol = await tokenBContract.symbol();
      await new Promise(r => setTimeout(r, 100));
      _pooledBig = await tokenBContract.balanceOf(poolAddress);
      await new Promise(r => setTimeout(r, 100));
      _pooled = bigNumToStr(_pooledBig);
      _onWalletBig = await tokenBContract.balanceOf(accounts[0]);
      await new Promise(r => setTimeout(r, 100));
      _onWallet = bigNumToStr(_onWalletBig);
      setTokenB({
        symbol: _symbol,
        contractAddress: _address,
        pooled: _pooled,
        pooledBig: _pooledBig,
        onWallet: _onWallet,
        onWalletBig: _onWalletBig});
      console.log(tokenB);
    } catch(err) {
      console.log(err);
      setError('Error in getPoolUpdate');
    }
  }
  async function depositOnPool() {
      if (typeof window.ethereum == 'undefined') { return; }
      getPoolUpdate();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, signer);
      const token1Contract = new ethers.Contract(/*token1Address*/tokenA.contractAddress, AssetERC20.abi, signer);
      const token2Contract = new ethers.Contract(/*token2Address*/tokenB.contractAddress, AssetERC20.abi, signer);
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
        setWaiting('Waiting for ' + tokenA.symbol + ' signature');
        await approve1.wait();
        setTransactionHash('');
        setWaiting('Waiting for ' + tokenB.symbol + ' signature');
        const approve2 = await token2Contract.approve(routerAddress, _amountB);
        setTransactionHash(approve2.hash);
        setWaiting('Waiting for ' + tokenB.symbol + ' signature');
        await approve2.wait();
        ClearPopups();
        setWaiting('Waiting for deposit');
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000) + 600;
        console.log(_reserve[0], _reserve[1]);
        const _minAmountA = (_amountA.mul(99)).div(100);
        const _minAmountB = (_amountB.mul(99)).div(100);
        const _deposit = await routerContract.addLiquidity(
          tokenA.contractAddress, 
          tokenB.contractAddress, 
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
      getPoolUpdate();
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
        const _withdraw = await routerContract.removeLiquidity(
          /*token1Address*/tokenA.contractAddress,
          /*token2Address*/tokenB.contractAddress,
          _amount,
          _amount,
          _amount,
          accounts[0],
          timestamp);
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
  async function withdrawAllFromPool() {        /*-------------------------------------------OK-*/
    if (typeof window.ethereum == 'undefined') { return; }
      getPoolUpdate();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, signer);
      const poolContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, signer);
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    try {
        ClearPopups();
        setWaiting('Waiting for signature');
        const approve = await poolContract.approve(
          routerAddress,
          liquidityToken.onWalletBig);
        setTransactionHash(approve.hash);
        await approve.wait();
        ClearPopups();
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000) + 600;
        const _withdraw = await routerContract.removeLiquidity(
          tokenA.contractAddress, 
          tokenB.contractAddress, 
          liquidityToken.onWalletBig, 
          0, 
          0, 
          accounts[0], 
          timestamp);
        setTransactionHash(_withdraw.hash);
        setWaiting('Waiting for transaction');
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
/*  async function getPair() {
    if (typeof window.ethereum == 'undefined') { return; }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const poolContract = new ethers.Contract(poolAddress, UniswapV2Pair.abi, provider);
  const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    try {
      let _address = await poolContract.token0();
      //provider.waitForTransaction(_address.hash);
      const tokenAContract = new ethers.Contract(_address, UniswapV2Pair.abi, provider);
      let _symbol = await tokenAContract.symbol();
      let _pooledBig = await tokenAContract.balanceOf(poolAddress);
      let _pooled = bigNumToStr(_pooledBig);
      let _onWalletBig = await tokenAContract.balanceOf(accounts[0]);
      let _onWallet = bigNumToStr(_onWalletBig);
      setTokenA({_symbol, _address, _pooled, _pooledBig, _onWallet, _onWalletBig});
      console.log(tokenA); 
      _address = await poolContract.token1();
      provider.waitForTransaction(_address.hash);
      const tokenBContract = new ethers.Contract(_address, UniswapV2Pair.abi, provider);
      _symbol = await tokenBContract.symbol();
      _pooledBig = await tokenBContract.balanceOf(poolAddress);
      _pooled = bigNumToStr(_pooledBig);
      _onWalletBig = await tokenBContract.balanceOf(accounts[0]);
      _onWallet = bigNumToStr(_onWalletBig);
      setTokenB({_symbol, _address, _pooled, _pooledBig, _onWallet, _onWalletBig});
      setInToken(tokenA);
      console.log(tokenB);
    } catch(err) {
      console.log(err);
    }
  }*/
  async function syncOutputAmount() {
    if (typeof window.ethereum == 'undefined') { console.log("return noMetamask"); return; }
    if (inTokenAmount[0] == 0) { return; }
    if (typeof(inTokenAmount[0]) == undefined) { return; }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const routerContract = new ethers.Contract(routerAddress, UniswapRouter.abi, provider);
    try {
      let output = await routerContract.getAmountOut(
        inTokenAmount,
        tokenB.pooledBig,
        tokenA.pooledBig
        );
        console.log('amountOut Calculated');
      setOutTokenAmount([bigNumToStr(output), output]);
      console.log(outTokenAmount[1]);
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
    const assetFromContract = new ethers.Contract(inToken.contractAddress, AssetERC20.abi, signer);
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000) + 600;
    try {
      setWaiting('Waiting for signature');
      const signature = await assetFromContract.approve(routerAddress, inTokenAmount);
      setTransactionHash(signature.hash);
      await signature.wait();
      setWaiting('Waiting for swap');
      const swapSuccessAmount = await routerContract.swapExactTokensForTokens(
        inTokenAmount,
        (inTokenAmount.mul(5)).div(10),
        [inToken.contractAddress, outToken.contractAddress],
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
        <button onClick={ClearPopups} className='popup-success'>{success}</button>
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
          <div className='item2'><a href={'https://goerli.etherscan.io/address/'+liquidityToken.contractAddress} target='_blank' rel='noreferrer' >{(liquidityToken.contractAddress).slice(0,(decimales+2))}...{(liquidityToken.contractAddress).slice(-decimales)}</a></div>
        </div>
        <div className='line'>
          <div className='item1'>
            Tokens owned
          </div>
          <div className='item2'>
            {liquidityToken.onWallet}
          </div>
        </div>
        <div className='line'>
          <div className='item1'>
            {tokenA.symbol}
          </div>
          <div className='item2'>
            {tokenA.pooled}
          </div>
        </div>
        <div className='line'>
          <div className='item1'>
            {tokenB.symbol}
          </div>
          <div className='item2'>
            {tokenB.pooled}
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
        {((inToken.contractAddress !== tokenA.contractAddress) && (inToken.contractAddress !== tokenB.contractAddress)) && (
          <div>
            <input className='faucet-management-input' style={{width: '17em'}} placeholder='amount' />
            <div className='lineBy2'>
              <button className='faucet-asset-button-not-selected' style={{width: '17em'}} onClick={() => {
                refresh();
                setInToken(tokenA)}}>
                  Refresh
              </button>
            </div>
          </div>
        )}
        {(inToken.contractAddress === tokenA.contractAddress) && (
          <div>
            <input className='faucet-management-input' style={{width: '17em'}} placeholder={tokenA.symbol+' amount'} onKeyUp={e => 
              setInTokenAmount(ethers.utils.parseEther(e.target.value))}/>
            <div className='lineBy2'>
              <button className='faucet-asset-button-selected'>{tokenA.symbol}</button>
              <button className='faucet-asset-button-not-selected' onClick={() => {
                setInToken(tokenB);
                setOutToken(tokenA);
                //setAmountToSwap(amountSwapped);
              }}>{tokenB.symbol}</button>
            </div>
          </div>)}
        {(inToken.contractAddress === tokenB.contractAddress) && (
          <div>
            <input className='faucet-management-input' style={{width: '17em'}} placeholder={tokenB.symbol+' amount'} onKeyUp={e => 
              setInTokenAmount(ethers.utils.parseEther(e.target.value))}/>
            <div className='lineBy2'>
              <button className='faucet-asset-button-not-selected' onClick={() => {
                setInToken(tokenA);
                setOutToken(tokenB);
                //setAmountToSwap(amountSwapped);
              }}>{tokenA.symbol}</button>
              <button className='faucet-asset-button-selected'>{tokenB.symbol}</button>
            </div>
        </div>)}
        <button className='faucet-default-button' style={{width: '17em'}} onClick={swap}>Swap for {outTokenAmount[0]} {outToken.symbol}</button>
      </div>
    </div>)
}