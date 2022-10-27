import { ethers } from 'ethers';

let decimales = 6;

export function displayPool(_address) {
   return (
      <a href={'https://goerli.etherscan.io/address/' + _address} target='_blank' rel='noreferrer' >
         {(_address).slice(0, (decimales + 2))} ... {(_address).slice(-decimales)}
      </a>
   )
}

export function bigNumToStr(_num) {
   const _amountRes = ethers.utils.formatEther(_num);
   return ((+_amountRes).toFixed(4));
}