import { View, FlatList, Text, useWindowDimensions, StyleSheet } from "react-native";
import PressableCard from "../components/PressableCard";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CategoryCard from "../components/CategoryCard";


const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const numColumns = width > height ? 3 : 2;

  const getCategories = async () => {
    try {
        setLoading(true)
        setError(null)
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/categories.php`
        )
        const json = await res.json()
        const mapped = (json.categories || []).map(c => ({
            id: c.idCategory,
            name: c.strCategory,
            thumb: c.strCategoryThumb
        }));
        setCategories(mapped)
    } catch (err) {
        setError(err)
    } finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    getCategories();
  }, [])

  return (
    <View>
      <FlatList
        data={categories}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 6 }}
        renderItem={({ item }) => (
          <PressableCard
            onPress={() => {
              navigation.navigate("RecipeListByCategory", { category: item });
            }}
            style={{ flex: 1 / numColumns, padding: 7 }}
          >
            <CategoryCard category={item} />
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
  empty: { textAlign: "center", color: "#6478b", marginTop: 40 },
});

export default CategoriesScreen;