import { useState, useEffect } from "react";
import downArrow from '../../img/downArrow.png';

let poolAddress = "0x2205d8f2bd0D127E4fE4159892Fe8d785B3Ab095";
let decimales = 6;

export function ManageSushiswapPools () {

    const [ manageSwitch, setManageSwitch ] = useState();

    return(<div>
        {!manageSwitch && (<div className='box' onClick={() => setManageSwitch(!manageSwitch)}>
        <div className="box-header-arrow">
            <div>Manage pool</div>
            <img src={downArrow} style={{height: '4vh'}} alt="down Arrow"/>
        </div>
        </div>)}
        {manageSwitch && (<div className='box' onClick={() => setManageSwitch(!manageSwitch)}>
        <div className="box-header-arrow">
            <div>Manage pool</div>
            <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}} alt="down Arrow"/>
        </div>
        <div className='line'>
            <div className='item2'>Pool address</div>
            <div className='item2'><a href={'https://goerli.etherscan.io/address/'+poolAddress} target='_blank' rel='noreferrer' >{(poolAddress).slice(0,(decimales+2))}...{(poolAddress).slice(-decimales)}</a></div>
        </div>
        </div>
        )}
    </div>)
}