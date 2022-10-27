import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import downArrow from '../../img/downArrow.png';

export function BigNumCalculators () {
    const [ calcSwitch, setCalcSwitch ] = useState();
    const [ bigNum, setBigNum ] = useState();
    const [ shortNum, setShortNum ] = useState('0');

    useEffect(() => {
        getBigNum();
    }, [shortNum]);

    useEffect(() => {
        getShortNum();
    }, [bigNum]);

    function getShortNum() {
    }

    function getBigNum() {
    }
    return(<div>
        {!calcSwitch && (<div className='box'>
            <div className='box-header-arrow' onClick={() => setCalcSwitch(!calcSwitch)}>
                <div>Calculators</div>
                <img src={downArrow} style={{height: '4vh'}}/>
            </div>
        </div>)}
        {calcSwitch && (<div className='box'>
            <div className='box-header-arrow' onClick={() => setCalcSwitch(!calcSwitch)}>
                <div>Calculators</div>
                <img src={downArrow} style={{height: '4vh', transform: 'rotate(180deg)'}}/>
            </div>{
            <div className="line">
                <input className='faucet-management-input' style={{width: '17em', marginLeft: 0}} placeholder='BigNum' /*onKeyUp={e => {setBigNum(e)}}*//>
                {shortNum}
            </div>}
            <div className="line">
                <input className='faucet-management-input' style={{width: '17em', marginLeft: 0}} placeholder='ShortNum' /*onKeyUp={e => {setShortNum(e)}}*//>
                {bigNum}
            </div>
        </div>)}
    </div>)
}