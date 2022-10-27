import { useState } from "react";
import downArrow from '../../img/downArrow.png';

//Adresses sur le testnet Goerli
let jeurAddress = "0x150d9A8b8b5DCf72CFabE303DAD915BD72B31D00";
// const jeurAddress ="0x36402523a25ef65FCbF32184a1834558114Db9A3;"
let eursAddress = "0xC1B34a591C935156C7AAE685Eb68C6d7980a98FD";
//const eursAddress = "0xC1B34a591C935156C7AAE685Eb68C6d7980a98FD";
let stablePoolFactory = "0x44afeb87c871D8fEA9398a026DeA2BD3A13F5769";
let eurPool = "0xdC3666bfa3fA213decde368c040d96232f0734d2";
let vaultAddress = "0xf0Bb52db8d78616754ed013CB629f90c82609f34";
let faucetAddress = "0xd7E83ea1f38f174639A8e58Df139cE89fDBE9B07";
let tokenListAddress = "0x5B2bE2Ed116DcC4Cb20b7c84BA028F8fAa8DA008";
let routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

let decimales = 5;


export function ContractsList () {

    const [ contractsSwitch, setContractsSwitch ] = useState(false);

    return(<div>
        <div>
            {!contractsSwitch && (<div className='box' onClick={() => setContractsSwitch(!contractsSwitch)}>
                <div className='box-header-arrow'>
                    <div>Contracts</div>
                    <img src={downArrow} style={{height: '4vh'}}/>
                </div>
            </div>)}
            {contractsSwitch && (<div className='box' onClick={() => setContractsSwitch(!contractsSwitch)}>
                <div className='box-header-arrow'>
                    <div>Contracts</div>
                    <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}}/>
                </div>
                <div className='line'>
                    <div className='item1'>jEUR :</div>
                    <div className='item2'><a href={'https://goerli.etherscan.io/address/'+jeurAddress} target="_blank" rel="noreferrer" >{jeurAddress.slice(0,(decimales+2))}...{jeurAddress.slice(-decimales)}</a></div>
                </div>
                <div className='line'>
                    <div className='item1'>EURs :</div>
                    <div className='item2'><a href={'https://goerli.etherscan.io/address/'+eursAddress} target="_blank" rel="noreferrer" >{eursAddress.slice(0,(decimales+2))}...{eursAddress.slice(-decimales)}</a></div>
                </div><div className='line'>
                    <div className='item1'>2EUR Pair</div>
                    <div className='item2'><a href={'https://goerli.etherscan.io/address/'+eurPool} target="_blank" rel="noreferrer" >{eurPool.slice(0,(decimales+2))}...{eurPool.slice(-decimales)}</a></div>
                </div>
                <div className='line'>
                    <div className='item1'>Factory :</div>
                    <div className='item2'><a href={'https://goerli.etherscan.io/address/'+stablePoolFactory} target="_blank" rel="noreferrer" >{stablePoolFactory.slice(0,(decimales+2))}...{stablePoolFactory.slice(-decimales)}</a></div>
                </div>
                <div className='line'>
                    <div className='item1'>Faucet :</div>
                    <div className='item2'><a href={'https://goerli.etherscan.io/address/'+faucetAddress} target="_blank" rel="noreferrer" >{faucetAddress.slice(0,(decimales+2))}...{faucetAddress.slice(-decimales)}</a></div>
                </div>
                <div className='line'>
                    <div className='item1'>Vault :</div>
                    <div className='item2'><a href={'https://goerli.etherscan.io/address/'+vaultAddress} target="_blank" rel="noreferrer" >{vaultAddress.slice(0,(decimales+2))}...{vaultAddress.slice(-decimales)}</a></div>
                </div>
                <div className='line'>
                    <div className='item1'>Router :</div>
                    <div className='item2'><a href={'https://goerli.etherscan.io/address/'+routerAddress} target="_blank" rel="noreferrer" >{routerAddress.slice(0,(decimales+2))}...{routerAddress.slice(-decimales)}</a></div>
                </div>
            </div>)}
        </div>
    </div>
    );
}
