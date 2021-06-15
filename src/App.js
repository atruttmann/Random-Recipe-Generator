import { useEffect, useState, useCallback } from "react";
import Tabletop from "tabletop";

const publicSpreadsheetURL =
  "https://docs.google.com/spreadsheets/d/1dXL6Ej3IREf2VLDP3zs-6QCwhfLphzsbxUmqekCri3c/edit?usp=sharing";

function App() {
  const [data, setData] = useState([]);
  const [currRecipe, setCurrRecipe] = useState();

  // Fetch data on load
  useEffect(() => {
    Tabletop.init({
      key: publicSpreadsheetURL,
      simpleSheet: false,
    })
      .then((data) => setData(data["Lunches/Dinners"].elements))
      .catch((err) => console.warn(err));
  }, []);

  // Choose a random recipe
  const setRandomRecipe = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * data.length);
    if (data.length > 0) {
      setCurrRecipe(data[randomIndex]);
    }
  }, [data]);

  // Set the current recipe once data has loaded
  useEffect(() => {
    setRandomRecipe();
  }, [data, setRandomRecipe]);

  return (
    <>
      <h1>Random Recipe Generator</h1>
      <p>
        This generator is based on{" "}
        <a href={publicSpreadsheetURL}>Alayna's Recipes</a> spreadsheet.
      </p>
      {currRecipe && (
        <>
          <h2>{currRecipe.Name}</h2>
          {currRecipe.Recipe.startsWith("http") ? (
            <a href={currRecipe.Recipe}>Link to recipe</a>
          ) : (
            <p>{`Shoot, there's no link for this. Check out the cookbook: ${currRecipe.Recipe}`}</p>
          )}
          <h3>Key Ingredients</h3>
          <p>
            <i>
              This is not an exhaustive list! See the recipe link for full
              details.
            </i>
          </p>
          <p>{currRecipe.Ingredients}</p>
        </>
      )}
      <button onClick={setRandomRecipe}>Refresh recipe</button>
    </>
  );
}

export default App;
