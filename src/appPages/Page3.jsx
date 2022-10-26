import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function Page3 () {
   const [ success, setSuccess ] = useState();
   const [ error, setError ] = useState();
   const [ waiting, setWaiting ] = useState();

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

  </div>)
}