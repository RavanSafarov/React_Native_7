import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FavoritesScreen from "../screens/FavoritesScreen";
import RecipeStack from "./RecipeStack";
import FavoriteRecipesStack from "./FavoriteRecipesStack"
import { useFavorites } from "../context/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const { favorites } = useFavorites();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1e6f8e",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarIcon: ({ color, size, focused }) => {
          return <Ionicons
            name={
              route.name === "Recipes"
                ? "restaurant"
                : focused
                ? "heart"
                : "heart-outline"
            }
            size={size}
            color={color}
          />;
        },
      })}
    >
      <Tab.Screen
        name="Recipes"
        component={RecipeStack}
        options={(route) => ({ headerShown: false, title: "Рецепты",
            tabBarStyle: {
                display: getFocusedRouteNameFromRoute(route) === 'RecipeDetile' ? 'none' : 'flex'
            }
         })}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoriteRecipesStack}
        options={{
          tabBarBadge: favorites.length || undefined,
          title: "Избранное",
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
