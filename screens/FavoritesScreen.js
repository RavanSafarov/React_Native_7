import {
  FlatList,
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
import { useFavorites } from "../context/FavoritesContext";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const { width, height } = useWindowDimensions();
  const numColumns = width > height ? 3 : 2;
  const { favorites } = useFavorites();

  const filtered = favorites.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
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
              navigation.navigate("RecipeDetail", { recipeId: item.id });
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

export default FavoritesScreen;
