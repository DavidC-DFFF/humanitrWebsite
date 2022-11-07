import { ethers } from 'ethers';

let decimales = 6;

export function displayPool(_address) {
   return (
      <a href={'https://goerli.etherscan.io/address/' + _address} target='_blank' rel='noreferrer' >
         {(_address).slice(0, (decimales + 2))} ... {(_address).slice(-decimales)}
      </a>
   )
}

export function displayAddress(_address, _decimals) {
   return (<div>
      {(_address).slice(0, (_decimals + 2))} ... {(_address).slice(-_decimals)}
   </div>)
}

export function bigNumToStr(_num, _decimals, _decimalsDisplayed) {
   const _amountRes = ethers.utils.formatUnits(_num, _decimals);
   return ((+_amountRes).toFixed(_decimalsDisplayed));
}