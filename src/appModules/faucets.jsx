import { useEffect, useState } from 'react';
import downArrow from '../img/downArrow.png';

export function Faucets() {

   const [ faucetSwitch, setFaucetSwitch ] = useState(true);

   useEffect(() => {

   }, [])

   return (
      <div>  {!faucetSwitch && (<div className='box'>
         <div className="box-header-arrow" onClick={() => setFaucetSwitch(!faucetSwitch)}>
            <div>Get some test funds</div>
            <img src={downArrow} style={{ height: '4vh' }} alt="down Arrow" />
         </div>
      </div>)}
         {faucetSwitch && (<div className='box'>
            <div className="box-header-arrow" onClick={() => setFaucetSwitch(!faucetSwitch)}>
               <div>Get some test funds</div>
               <img src={downArrow} style={{ height: '4vh', transform: 'rotate(180deg)' }} alt="down Arrow" />
            </div>
            <div className="line">
               <a href="https://faucets.chain.link/" className="item1">Get gETH</a>
               <div>from Chainlink</div>
            </div>
            <div className="line">
               <a href="https://app.aave.com/faucet/">Get some USDC</a>
               <div>from AAVE</div>
            </div>
         </div>)}
      </div>)
}