import AsyncStorage from "@react-native-async-storage/async-storage";

export async function save(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("save error", err);
  }
}

export async function load(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);

    return raw != null ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

export async function remove(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn("remove error", err);
  }
}
