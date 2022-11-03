import { useEffect, useState } from 'react';

export function ChooseCar() {

   const [cars, setCars] = useState([]);
   const [currentCar, setCurrentCar] = useState();

   useEffect(() => {
      declareCar();
   }, [])


   async function declareCar() {
      try {
         setCars([]);
         setCars(prev => [...prev, { _owner: "John", _brand: "Ferrari", _model: "F458" }]);
         setCars(prev => [...prev, { _owner: "Jim", _brand: "Porsche", _model: "993" }]);
         setCars(prev => [...prev, { _owner: "Joe", _brand: "Aston Martin", _model: "Vantage" }]);

         console.log({ cars });

      } catch (err) {
         console.log(err);
      }
   }

   function viewConsole() {
      console.log(currentCar);
   }

   return (<div>

      <label htmlFor="car-choice">Car :</label>
      <input list="Car" id="car-choice" name="car-choice" onChange={e => console.log(e)} />
      <datalist id="Car">
         {cars.map(car => (
            <option key={car.index} id={car._model} value={car._brand}></option>
         ))}
      </datalist>
      <div>
         <button onClick={declareCar}>Refresh</button>
         <button onClick={viewConsole}>console</button>
      </div>
      <div>{currentCar}</div>
   </div>)
}