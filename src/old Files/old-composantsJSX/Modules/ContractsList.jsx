import { useState } from "react";
import { displayPool } from "./commonFunctions";
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

let wallet1 = "0x8a759Fb766AdbD1D2823d8e5f5734075E9E3E6ed";
let wallet2 = "0x3d88B83cfBC9a90F9D8d75f46FE360B6fe14a656";

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
                    <div className='item2'>{displayPool(jeurAddress)}</div>
                </div>
                <div className='line'>
                    <div className='item1'>EURs :</div>
                    <div className='item2'>{displayPool(eursAddress)}</div>
                </div><div className='line'>
                    <div className='item1'>2EUR Pair</div>
                    <div className='item2'>{displayPool(eurPool)}</div>
                </div>
                <div className='line'>
                    <div className='item1'>Factory :</div>
                    <div className='item2'>{displayPool(stablePoolFactory)}</div>
                </div>
                <div className='line'>
                    <div className='item1'>Faucet :</div>
                    <div className='item2'>{displayPool(faucetAddress)}</div>
                </div>
                <div className='line'>
                    <div className='item1'>Vault :</div>
                    <div className='item2'>{displayPool(vaultAddress)}</div>
                </div>
                <div className='line'>
                    <div className='item1'>Router :</div>
                    <div className='item2'>{displayPool(routerAddress)}</div>
                </div>
                <div className='line'>
                    <div className='item1'>Wallet 1</div>
                    <div className='item2'>{displayPool(wallet1)}</div>
                </div>
                <div className='line'>
                    <div className='item1'>Wallet 2</div>
                    <div className='item2'>{displayPool(wallet2)}</div>
                </div>
            </div>)}
        </div>
    </div>
    );
}
