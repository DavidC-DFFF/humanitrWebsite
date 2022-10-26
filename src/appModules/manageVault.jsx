import { useState, useEffect } from "react";
import downArrow from '../img/downArrow.png';

const decimales = 6;
const poolAddress = "0xfEfBE6428e002a034f40C57E60fb2F915620BD04";

export function ManageVault () {

    const [ manageSwitch, setManageSwitch ] = useState(true);

    return(<div>
        {!manageSwitch && (<div className='box' onClick={() => setManageSwitch(!manageSwitch)}>
        <div className="box-header-arrow">
            <div>Manage your funds</div>
            <img src={downArrow} style={{height: '4vh'}} alt="down Arrow"/>
        </div>
        </div>)}
        {manageSwitch && (<div className='box' onClick={() => setManageSwitch(!manageSwitch)}>
        <div className="box-header-arrow">
            <div>Manage your funds</div>
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