export function CarTest() {
   let carsArray = [
      { owner: "Jim", brand: "Buick" },
      { owner: "John", brand: "Cadillac" },
      { owner: "Jim", brand: "Chevrolet" }
   ];
   console.log(carsArray);
   return (<div>
      <form>
         <input type="input" list="optionsList" placeholder="Select a car" />
         <datalist id="optionsList">
            {carsArray.map(
               (car) => <option key={car.owner}>{car.brand}</option>)}
         </datalist>
      </form>
   </div>)
}