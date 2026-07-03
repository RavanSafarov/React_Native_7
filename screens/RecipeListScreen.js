import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RECIPES } from "../data/recipes";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import PressableCard from "../components/PressableCard";
import { load, save } from "../utils/storage";

const RecipeListScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const { width, height } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [views, setViews] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("All");
  const numColumns = width > height ? 3 : 2;

  // const filtered = RECIPES.filter((item) =>
  //   item.name.toLowerCase().includes(query.toLowerCase()),
  // );

  const getMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res =
        selectedCountry === "All"
          ? await fetch(
            `https://themealdb.com/api/json/v1/1/search.php?s=${query}`
          )
          : await fetch(
            `https://themealdb.com/api/json/v1/1/filter.php?a=${selectedCountry}`
          );
      const json = await res.json();
      const mapped = (json.meals || []).map((m) => ({
        id: m.idMeal,
        name: m.strMeal,
        category: m.strCategory,
        area: m.strArea,
        thumb: m.strMealThumb,
      }));
      setRecipes(mapped);
    } catch (err) {
      setError("Нет сети");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
      );

      const json = await res.json();

      const mapped = (json.meals || []).map((i) => ({
        area: i.strArea,
      }));

      setCountries(mapped);

      const favorite = await load("favoriteCategory", "All");
      setSelectedCountry(favorite);
    })();
  }, []);
  useEffect(() => {
    let timeout = setTimeout(() => {
      getMeals();
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, selectedCountry]);
  useEffect(() => {
    (async () => {
      const data = await load("views", {});
      setViews(data);
    })();
  }, []);
  return (
    <View style={styles.screen}>
      <TextInput
        onChangeText={setQuery}
        placeholder="Searching recipe"
        placeholderTextColor={"#94a3b8"}
        style={styles.search}
      />
      <Pressable
        style={styles.historyButton}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.historyButtonText}>История</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <Text>{isOpen ? "🔍 Close filter" : "🔍 Filter"}</Text>
      </Pressable>
      {isOpen ? (
        <View style={styles.filterContainer}>
          <Pressable
            onPress={async () => {
              setSelectedCountry("All");
              await save("favoriteCategory", "All");
              setIsOpen(false);
            }}
          >
            <Text>All</Text>
          </Pressable>

          <ScrollView>
            {countries.map((item) => (
              <Pressable
                key={item.area}
                onPress={async () => {
                  setSelectedCountry(item.area);
                  await save("favoriteCategory", item.area);
                  setIsOpen(false);
                }}
              >
                <Text>{item.area}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : (
        <></>
      )}
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size={"large"}
          color="#61DAFB"
        />
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{ textAlign: "center", marginTop: 40, color: "#FF0000" }}
          >
            {error}
          </Text>
          <Pressable
            style={{
              marginTop: 20,
              padding: 20,
              backgroundColor: "#73C2FB",
              borderRadius: 12,
            }}
            onPress={() => {
              getMeals();
            }}
          >
            <Text>Повторить</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={recipes}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 6 }}
          renderItem={({ item }) => (
            <PressableCard
              style={{ flex: 1 / numColumns, padding: 7 }}
              onPress={async () => {
                
                const recent = await load("recent", []);
                const filtered = recent.filter((r) => r.id !== item.id);
                const next = [item, ...filtered].slice(0, 20);
                await save("recent", next);

                
                const currentViews = await load("views", {});
                currentViews[item.id] = (currentViews[item.id] || 0) + 1;
                await save("views", currentViews);
                setViews(currentViews);

                navigation.navigate("RecipeDetail", {
                  recipe: item,
                });
              }}
            >
              <RecipeCard
                recipe={item}
                views={views[item.id] || 0}
              />
            </PressableCard>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nothing is found</Text>
          }
        />
      )}
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
  historyButton: {
    backgroundColor: "#73C2FB",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
    marginBottom: 10,
  },

  historyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RecipeListScreen;
