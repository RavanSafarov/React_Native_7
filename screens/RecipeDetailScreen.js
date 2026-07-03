import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  Text,
  View,
  Linking,
  Button
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const RecipeDetailsScreen = () => {
  const db = useSQLiteContext()
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState("");
  const { recipe } = useRoute().params;
  const navigation = useNavigation();

  async function loadNotes() {
    const rows = await db.getAllAsync(
      "SELECT * FROM notes WHERE recipeId = ? ORDER BY createdAt DESC",
      [recipe.id]
    );

    setNotes(rows);
  }
  async function addNodes() {
    if (!noteText.trim()) return;

    await db.runAsync(
      "INSERT INTO notes (recipeId, text) VALUES (?, ?)",
      [recipe.id, noteText]
    );

    setNoteText("");
    loadNotes();
  }
  async function deleteNodes(id) {
    await db.runAsync(
      "DELETE FROM notes WHERE id = ?",
      [id]
    );

    loadNotes();
  }

  useEffect(() => { loadNotes() }, [])
  useEffect(() => { addNodes() }, [])
  useEffect(() => { deleteNodes() }, [])

  useEffect(() => {
    navigation.setOptions({ title: recipe.name });
  }, [recipe]);

  const [full, setFull] = useState();
  const [instructions, setInstructions] = useState("");
  const [smallInstructions, setSmallInstructions] = useState("");
  const [instructionsAreFull, setInstructionsAreFull] = useState(false);

  const getRecipe = () => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.id}`)
      .then((r) => r.json())
      .then((j) => setFull(j.meals[0]))
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRecipe();
  }, [recipe.id]);

  const ingredients = [];

  if (full) {
    for (let i = 1; i <= 20; i++) {
      const ing = full["strIngredient" + i];
      const mea = full["strMeasure" + i];

      if (ing && ing.trim()) ingredients.push(`${ing} = ${mea}`);
    }
  }

  useEffect(() => {
    if (full) {
      setInstructions(full.strInstructions);
      setSmallInstructions(full.strInstructions.slice(0, 200));
    }
  }, [full]);


  const onShare = async () => {
    try {
      const result = await Share.share({
        title: "Sharing recipe",
        message: `Готовлю: ${recipe.name} (${recipe.area})`,
      });
    } catch (err) { }
  };

  let youtube = "";

  if (full) {
    youtube = full.strYoutube;
  }

  const onLinkYoutube = () => {
    Linking.openURL(youtube);
  };

  const getCategoryObj = async () => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`,
    );
    const json = await res.json();
    const mapped = (json.categories || []).map((c) => ({
      id: c.idCategory,
      name: c.strCategory,
      thumb: c.strCategoryThumb,
    }));
    const categoryObj = mapped.find(i => i.name === recipe.category)
    console.log(categoryObj)
    return categoryObj
  };

  return (
    <ScrollView style={styles.screen}>
      <Image source={{ uri: recipe.thumb }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.meta}>Категория: {recipe.category}</Text>
        <Text style={styles.meta}>Страна: {recipe.area}</Text>
        <Text style={styles.section}>Ингредиенты:</Text>
        {ingredients.map((t) => {
          return (
            <Text key={t} style={styles.text}>
              {t}
            </Text>
          );
        })}
        <Text style={{ marginTop: 10, color: "#C0C0C0", fontSize: 18 }}>
          Инструкции: {instructionsAreFull ? instructions : smallInstructions}
          {instructions.length < 200 ? (
            <></>
          ) : (
            <Pressable onPress={() => setInstructionsAreFull((prev) => !prev)}>
              <Text style={{ color: "#181717" }}>
                {instructionsAreFull ? "   Show less" : "...Show more"}
              </Text>
            </Pressable>
          )}
        </Text>
      </View>
      <Pressable
        style={styles.pressable}
        onPress={() => {
          navigation.navigate("RecipeListByCategory", {
            category: getCategoryObj(),
          });
        }}
      >
        <Text>Ещё из этой категории</Text>
      </Pressable>
      <Pressable style={styles.pressable} onPress={onShare}>
        <Text>Поделиться рецептом</Text>
      </Pressable>
      {youtube ? (
        <Pressable style={styles.pressable} onPress={onLinkYoutube}>
          <Text>Youtube video</Text>
        </Pressable>
      ) : (
        <></>
      )}
      <View>
        <TextInput
          value={noteText}
          onChangeText={setNoteText}
          placeholder="Введите заметку"
          style={{
            borderWidth: 1,
            padding: 10,
            margin: 10,
            borderRadius: 8
          }}
        />
        <Button
          title="Добавить заметку"
          onPress={addNodes}
        />
        {notes.map(item => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10
            }}
          >
            <Text>{item.text}</Text>
            <Button
              title="Удалить"
              onPress={() => deleteNodes(item.id)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 240 },
  body: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  meta: { fontSize: 14, color: "#64748b", marginTop: 4 },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
    color: "#1e29eb",
  },
  text: { fontSize: 15, color: "#64748b", marginTop: 40 },
  pressable: {
    marginTop: 8,
    alignItems: "center",
    backgroundColor: "#759ddd",
    padding: 10,
  },
});

export default RecipeDetailsScreen;
