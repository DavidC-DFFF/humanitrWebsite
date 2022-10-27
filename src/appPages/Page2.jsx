import { useState, useEffect } from 'react';
//import { ethers } from 'ethers';

import { ManageVault } from '../appModules/manageVault';

export function Page2 () {
   const [ success, setSuccess ] = useState();
   const [ error, setError ] = useState();
   const [ waiting, setWaiting ] = useState();

   useEffect(() => {
      //refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   },[]);

   function ClearPopups() {
      setError('');
      setSuccess('');
      setWaiting('');
   }

   return (<div>
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
            {waiting}
         </button>
      </div>)}
      <ManageVault />
   </div>)
}