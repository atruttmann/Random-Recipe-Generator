import { useEffect, useState, useCallback } from "react";
import Tabletop from "tabletop";
import VegIcon from "./veg-icon.png";
import MealPrepIcon from "./meal-prep.png";
import "./App.scss";

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

  const hasRecipeLink =
    currRecipe.Recipe.startsWith("http") || currRecipe.Recipe.startsWith("www");
  const hasIngredients = currRecipe.Ingredients !== "";
  const hasNotes = currRecipe.Notes !== "";
  const mealPrepFriendly = currRecipe["Meal preps well"] === "Yes";
  const vegetarianOnly =
    currRecipe.Vegetarian === "Yes" && currRecipe.Vegan !== "Yes"; // only show if not also vegan
  const vegan = currRecipe.Vegan === "Yes";
  const showDetails = hasNotes || mealPrepFriendly || vegetarianOnly || vegan;

  return (
    <div className="app">
      <header>
        <h1>Random Recipe Generator</h1>
        <p>
          This generator is based on my{" "}
          <a
            href={publicSpreadsheetURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Alayna's Recipes
          </a>{" "}
          spreadsheet.
        </p>
      </header>

      <section>
        <button className="refresh" onClick={setRandomRecipe}>
          Refresh recipe
        </button>

        {currRecipe && (
          <>
            <h2>{currRecipe.Name}</h2>
            {hasRecipeLink ? (
              <a
                href={currRecipe.Recipe}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link to recipe
              </a>
            ) : (
              <p>{`There's no link for this. Check out the cookbook: ${currRecipe.Recipe}`}</p>
            )}

            {hasIngredients && (
              <>
                <h3>Key Ingredients</h3>
                <p>{currRecipe.Ingredients}</p>
              </>
            )}

            {showDetails && (
              <>
                <h3>Details</h3>
                {hasNotes && (
                  <p>
                    <b>Alayna's Notes:</b>
                    {` ${currRecipe.Notes}`}
                  </p>
                )}
                <div className="iconContainer">
                  {mealPrepFriendly && (
                    <div className="iconGroup">
                      <img
                        src={MealPrepIcon}
                        className="icon"
                        alt="Meal prep icon"
                      />
                      Meal prep friendly
                    </div>
                  )}
                  <div className="iconGroup">
                    {vegetarianOnly && (
                      <>
                        <img
                          src={VegIcon}
                          className="icon"
                          alt="Vegetarian icon"
                        />
                        Vegetarian
                      </>
                    )}
                    {vegan && (
                      <>
                        <img src={VegIcon} className="icon" alt="Vegan icon" />
                        Vegan
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </section>

      <footer>
        <p>
          Check out the source code on{" "}
          <a
            href="https://github.com/atruttmann/Random-Recipe-Generator"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
