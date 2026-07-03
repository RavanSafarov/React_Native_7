import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Linking,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";

const AboutAppScreen = () => {
  const [name, setName] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const addName = async (newName) => {
    await AsyncStorage.setItem("nickname", newName);
  };

  const deleteName = async () => {
    setName("");
    await AsyncStorage.removeItem("nickname");
  };

  const addArr = async () => {
    const favorites = [52772, 52959, 32123];
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  };

  useEffect(() => {
    const loadName = async () => {
      try {
        const n = await AsyncStorage.getItem("nickname");
        setName(n);

        const raw = await AsyncStorage.getItem("favorites");
        const list = raw != null ? JSON.parse(raw) : [];
        setFavorites(list);
      } catch (err) {
        console.warn("Error");
      }
    };

    loadName();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!loaded) return;

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites))
    };

    load()
  }, [favorites, loaded]);

  return (
    <View style={styles.screen}>
      <View></View>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 2,
          borderColor: "black",
          width: "100%",
          height: 40,
          marginBottom: 10,
        }}
      />
      <Button title="Add" onPress={() => addName(name)} />
      <Button title="Delete" onPress={() => deleteName()} />
      <Button title="Add Array" onPress={addArr} />
      {/* <Pressable
        onPress={() =>
          Linking.openURL("https://github.com/aviator2110/recipes")
        }
      >
        <Image
          style={styles.githubIcon}
          source={require("../assets/icons/github-icon.png")}
        />
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 8,
    backgroundColor: "#F4F7FA",
  },
  githubIcon: { width: 150, height: 150 },
});

export default AboutAppScreen;
