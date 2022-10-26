import { Faucets } from '../Modules/Faucets.jsx';
import { ContractsList } from '../Modules/ContractsList.jsx';
import { BigNumCalculators } from '../Modules/BigNumCalculators.jsx';

export function Page5 () {
  return(<div>
    <BigNumCalculators />
    <Faucets />
    <ContractsList />
  </div>
  )
}