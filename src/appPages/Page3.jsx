import { Faucets } from '../appModules/faucets';
import { BurnKRM } from '../appModules/burnKRM';
/*import { Tests } from '../appModules/tests';
import { TestArrayForDev } from '../appModules/testArrayForDev';
import { Vault_USDC_AAVE } from '../appModules/vault_USDC_AAVE';*/

export function Page3() {

   return (<div>
      <Faucets />
      <BurnKRM />

   </div>)
}