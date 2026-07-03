import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import RecipeListByCategory from "../screens/RecipeListByCategoryList";
import RecipeDetailsScreen from "../screens/RecipeDetailScreen";

const Stack = createNativeStackNavigator();

const CategoriesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="CategoriesScreen"
      screenOptions={{
        headerStyle: { backgroundColor: "#2823A" },
        headerTintColor: "#61DAFB",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="CategoriesScreen"
        component={CategoriesScreen}
        options={{ title: `Categories` }}
      />
      <Stack.Screen
        name="RecipeListByCategory"
        component={RecipeListByCategory}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailsScreen} 
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
