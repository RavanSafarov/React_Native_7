import RecipeListScreen from "../screens/RecipeListScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailScreen";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { RECIPES } from "../data/recipes";
import RecipeListByCategory from "../screens/RecipeListByCategoryList";
import AboutAppScreen from "../screens/AboutAppScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FavoritesScreen from "../screens/FavoritesScreen";

const Stack = createNativeStackNavigator();

const FavoriteRecipesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="FavoritesScreen"
      screenOptions={{
        headerStyle: { backgroundColor: "#2823A" },
        headerTintColor: "#61DAFB",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={({ navigation }) => ({
          title: "Favorites",

          headerRight: () => {
            const r = RECIPES[Math.floor(Math.random() * RECIPES.length)];

            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: 16,
                }}
              >
                <Pressable
                  onPress={() => {
                    navigation.navigate("AboutApp");
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 500 }}>О нас</Text>
                </Pressable>
              </View>
            );
          },
        })}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailsScreen}
        options={({ navigation }) => ({
          headerRight: () => {
            const r = RECIPES[Math.floor(Math.random() * RECIPES.length)];

            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("RecipeDetail", { recipeId: r.id })
                }
              >
                <Image
                  style={styles.diceIcon}
                  source={require("../assets/icons/dice-cube-icon.png")}
                />
              </Pressable>
            );
          },
        })}
      />
      <Stack.Screen
        name="RecipeListByCategory"
        component={RecipeListByCategory}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutAppScreen}
        options={{ title: "О приложении" }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  diceIcon: { width: 40, height: 40 },
});

export default FavoriteRecipesStack;
