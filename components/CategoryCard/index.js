import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";

const CategoryCard = ({ category }) => {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: category.thumb }} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {category.name}
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
      android: { elevation: 3 },
    }),
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  info: {
    position: "static",
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
  },
});

export default CategoryCard