import { NavigationContainer } from "@react-navigation/native";
import FavoritesProvider from "./context/FavoritesContext";
import RootDrawer from "./routes/RootDrawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-gesture-handler"
import { SQLiteProvider } from "expo-sqlite";


async function initDb(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes  (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  
      recipeId TEXT NOT NULL,
      text TEXT NOT NULL,
      createdAT TEXT DEFAULT (datetime('now'))
    );
    `
  )
}

export default function App() {
  return (
    <SQLiteProvider databaseName="recipes.db" onInit={initDb}>
      <GestureHandlerRootView>
        <FavoritesProvider>
          <NavigationContainer>
            <RootDrawer />
          </NavigationContainer>
        </FavoritesProvider>
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}
