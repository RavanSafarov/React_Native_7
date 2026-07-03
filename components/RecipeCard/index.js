import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Pressable,
} from "react-native";
import { useFavorites } from "../../context/FavoritesContext";

const RecipeCard = ({ recipe, views }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: recipe.thumb }} />

      <Pressable
        style={styles.pressableHearts}
        onPress={() => toggleFavorite(recipe)}
      >
        <Text style={{ fontSize: 20 }}>
          {isFavorite(recipe.id) ? "❤️" : "🤍"}
        </Text>
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>

        <Text style={styles.category}>
          {recipe.category ?? "Без категории"}
        </Text>

        <Text style={styles.views}>
          👁 Просмотров: {views}
        </Text>

        <Text style={styles.area}>
          {recipe.area ?? "unknown"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  image: {
    width: "100%",
    aspectRatio: 1,
  },

  info: {
    padding: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
  },

  category: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },

  views: {
    marginTop: 4,
    fontSize: 12,
    color: "#555",
  },

  area: {
    fontSize: 10,
    color: "#fff",
    marginTop: 2,
    backgroundColor: "green",
    padding: 4,
    position: "absolute",
    top: 8,
    right: 4,
    borderRadius: 4,
  },

  pressableHearts: {
    position: "absolute",
    top: 4,
    left: 4,
  },
});

export default RecipeCard;