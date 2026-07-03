import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export const FavoritesContext = createContext();
const KEY = "favorites";

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw != null) {
          const list = await JSON.parse(raw);
          setFavorites(list);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!loaded) return;
      AsyncStorage.setItem(KEY, JSON.stringify(favorites));
    })();
  }, [favorites]);

  const toggleFavorite = (recipe) => {
    setFavorites((prev) =>
      prev.find((item) => item.id === recipe.id)
        ? prev.filter((item) => item.id !== recipe.id)
        : [...prev, recipe]
    );
  };

  const isFavorite = (id) => favorites.find((item) => item.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
export default FavoritesProvider;
