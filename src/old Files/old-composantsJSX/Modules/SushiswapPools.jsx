import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import downArrow from '../../img/downArrow.png';
import { displayPool } from './commonFunctions.jsx';

const masterchef = "0x80C7DD17B01855a6D2347444a0FCC36136a314de";
const sushiV2Factory = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
const sushiswapRouter = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
const sushiBar = "0x1be211D8DA40BC0ae8719c6663307Bfc987b1d6c";
const sushiMaker = "0x1b9d177CcdeA3c79B6c8F40761fc8Dc9d0500EAa";
const sushiRoll = "0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5" ;
const sushiToken = "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F";

const masterchefSelf = "0x4282BbB6a46bAB6d51a3B24900DF9e27D5924348";
const masterchefSelf2 = "0xB3E32e6Df154ccE38c545d2FD16c43D1D6981247";
const sushiTokenSelf = "0x50E85E8610c0698Aa14D8BBFC863F6F4280617fE";

const univ2 = "0xdC3666bfa3fA213decde368c040d96232f0734d2";
const slp = "0x2205d8f2bd0D127E4fE4159892Fe8d785B3Ab095";

export function SushiswapPools () {
    const [ poolSwitch, setPoolSwitch ] = useState();
    return(<div>
        {!poolSwitch && (<div className='box'>
            <div className='box-header-arrow' onClick={() => setPoolSwitch(!poolSwitch)}>
                <div>Sushiswap pool</div>
                <img src={downArrow} style={{height: '4vh'}} alt="down Arrow"/>
            </div>
        </div>)}
        {poolSwitch && (<div className='box' onClick={() => setPoolSwitch(!poolSwitch)}>
            <div className='box-header-arrow'>
                <div>Sushiswap pool</div>
                <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}} alt="down Arrow"/>
            </div>
            <div className='line'>
                <div className='item2'>Masterchef original</div>
                <div className='item2'>{displayPool(masterchef)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Masterchef self-deployed</div>
                <div className='item2'>{displayPool(masterchefSelf)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Masterchef self-deployed 2</div>
                <div className='item2'>{displayPool(masterchefSelf2)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Factory</div>
                <div className='item2'>{displayPool(sushiV2Factory)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Router</div>
                <div className='item2'>{displayPool(sushiswapRouter)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Bar</div>
                <div className='item2'>{displayPool(sushiBar)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Maker</div>
                <div className='item2'>{displayPool(sushiMaker)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Roll</div>
                <div className='item2'>{displayPool(sushiRoll)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Sushi</div>
                <div className='item2'>{displayPool(sushiToken)}</div>
            </div>
            <div className='line'>
                <div className='item2'>Sushi self-deployed</div>
                <div className='item2'>{displayPool(sushiTokenSelf)}</div>
            </div>
            <div className='line'>
                <div className='item2'>jEUR-sEUR SLP</div>
                <div className='item2'>{displayPool(slp)}</div>
            </div>
            <div className='line'>
                <div className='item2'>jEUR-sEUR UNI LP</div>
                <div className='item2'>{displayPool(univ2)}</div>
            </div>
        </div>)}
    </div>)
}