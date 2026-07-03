import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RECIPES } from "../data/recipes";
import RecipeCard from "../components/RecipeCard";
import { useState } from "react";
import PressableCard from "../components/PressableCard";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";

const RecipeListByCategory = () => {
  const { category } = useRoute().params;
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    navigation.setOptions({ title: category.name });
  }, []);
  const numColumns = width > height ? 3 : 2;

  const getMeals = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood`
      )
      const json = await res.json()
      const mapped = (json.meals || []).map(m => ({
        id: m.idMeal,
        name: m.strMeal,
        category: category.name,
        area: m.strArea,
        thumb: m.strMealThumb,
      }))

      setMeals(mapped)
    } catch(err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getMeals()
  }, [])

  const filtered = meals.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={styles.screen}>
      <TextInput
        onChangeText={setQuery}
        placeholder="Searching recipe"
        placeholderTextColor={"#94a3b8"}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 6 }}
        renderItem={({ item }) => (
          <PressableCard
            onPress={() => {
              navigation.navigate("RecipeDetail", { recipe: item });
            }}
            style={{ flex: 1 / numColumns, padding: 7 }}
          >
            <RecipeCard recipe={item} />
          </PressableCard>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nothing is found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 8,
    backgroundColor: "#F4F7FA",
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginHorizontal: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  empty: { textAlign: "center", color: "#6478b", marginTop: 40 },
});

export default RecipeListByCategory;
