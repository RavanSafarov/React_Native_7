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
import { useNavigation, useRoute } from "@react-navigation/native";

const RecipeDetailsScreen = () => {
  const db = useSQLiteContext();

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const { recipe } = useRoute().params;
  const navigation = useNavigation();

  async function loadNotes() {
    const rows = await db.getAllAsync(
      "SELECT * FROM notes WHERE recipeId = ? ORDER BY createdAt DESC",
      [recipe.id]
    );
    setNotes(rows);
  }

 
  async function loadAverage() {
    const row = await db.getFirstAsync(
      "SELECT AVG(rating) as avg FROM notes WHERE recipeId = ?",
      [recipe.id]
    );

    setAvgRating(row?.avg ? Number(row.avg) : 0);
  }

 
  async function refresh() {
    await loadNotes();
    await loadAverage();
  }

 
  async function addNodes() {
    if (!noteText.trim()) return;

    await db.runAsync(
      "INSERT INTO notes (recipeId, text, rating) VALUES (?, ?, ?)",
      [recipe.id, noteText, rating]
    );

    setNoteText("");
    setRating(0);

    await refresh();
  }

  async function deleteNodes(id) {
    await db.runAsync(
      "DELETE FROM notes WHERE id = ?",
      [id]
    );

    await refresh();
  }

  
  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `${recipe.name} (${notes.length})`,
    });
  }, [recipe, notes]);

 
  const onShare = async () => {
    try {
      await Share.share({
        title: "Sharing recipe",
        message: `Готовлю: ${recipe.name} (${recipe.area})`,
      });
    } catch (err) {}
  };

  
  const onLinkYoutube = () => {
    if (recipe?.youtube) Linking.openURL(recipe.youtube);
  };

  return (
    <ScrollView style={styles.screen}>
      <Image source={{ uri: recipe.thumb }} style={styles.image} />

      <View style={styles.body}>
        <Text style={styles.title}>{recipe.name}</Text>

        <Text style={styles.meta}>Категория: {recipe.category}</Text>
        <Text style={styles.meta}>Страна: {recipe.area}</Text>

        <Text style={styles.meta}>
          Средняя оценка: {avgRating.toFixed(1)} ⭐
        </Text>

        <Text style={styles.section}>Заметки:</Text>

        {notes.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10
            }}
          >
            <View>
              <Text>{"⭐".repeat(item.rating)}</Text>
              <Text>{item.text}</Text>
            </View>

            <Button
              title="Удалить"
              onPress={() => deleteNodes(item.id)}
            />
          </View>
        ))}

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

        <Text style={{ marginLeft: 10 }}>Оценка:</Text>

        <View style={{ flexDirection: "row", margin: 10 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)}>
              <Text
                style={{
                  fontSize: 30,
                  color: star <= rating ? "gold" : "gray"
                }}
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        <Button title="Добавить заметку" onPress={addNodes} />
      </View>

      <Pressable style={styles.pressable} onPress={onShare}>
        <Text>Поделиться рецептом</Text>
      </Pressable>

      <Pressable style={styles.pressable} onPress={onLinkYoutube}>
        <Text>Youtube video</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 240 },
  body: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  meta: { fontSize: 14, color: "#64748b", marginTop: 4 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  pressable: {
    marginTop: 8,
    alignItems: "center",
    backgroundColor: "#759ddd",
    padding: 10,
  },
});

export default RecipeDetailsScreen;