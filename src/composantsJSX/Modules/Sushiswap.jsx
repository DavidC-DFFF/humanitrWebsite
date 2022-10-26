import { useState, useEffect } from 'react';
import AssetERC20 from '../../artifacts/contracts/assetERC20.sol/AssetERC20.json';
import UniswapV2Pair from '../../artifacts/contracts/uniswapv2pair.sol/UniswapV2Pair.json';
import UniswapRouter from '../../artifacts/contracts/uniswaprouter.sol/UniswapRouter.json';
import { SushiswapPools } from './SushiswapPools.jsx';
import { ManageSushiswapPools } from './ManageSushiswapPools.jsx';
import { SwapSushiswap } from './SwapSushiswap.jsx';

let poolAddress = "0x2205d8f2bd0D127E4fE4159892Fe8d785B3Ab095";
let decimales = 6;

export function Sushiswap () {
  const [ success, setSuccess ] = useState();
  const [ error, setError ] = useState();
  const [ waiting, setWaiting ] = useState();
  const [ transactionHash, setTransactionHash ] = useState();

  const token = {
    symbol: '',
    contractAddress: '',
    pooled: 0,
    pooledBig: 0,
    onWallet: 0,
    onWalletBig: 0
  };

  useEffect(() => {
    setTransactionHash('0xae5b093ada8a911a10e0e779b423e64b72fa993330cc527cb2fc1b7742fdbac8');
  }, [])

  function ClearPopups() {
    setError('');
    setSuccess('');
    setWaiting('');
  }
  
  return (
    <div>
      <div>                     {/*------------- Popups --*/}
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
            <a href={'https://goerli.etherscan.io/tx/'+transactionHash} className='pop-waiting-link' target='_blank' rel='noreferrer' >{waiting}</a>
          </button>
        </div>)}
      </div>
      <SushiswapPools />
      <ManageSushiswapPools />
      <SwapSushiswap />
    </div>)
}