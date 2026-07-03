import { useEffect, useState } from "react";
import { View, FlatList, Button } from "react-native";
import { load, save } from "../utils/storage";
import RecipeCard from "../components/RecipeCard";
import PressableCard from "../components/PressableCard";
import { useNavigation } from "@react-navigation/native";
export default function HistoryScreen() {
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);
    async function loadHistory() {

        const data = await load("recent", []);

        setHistory(data);

    }
    useEffect(() => {

        const unsubscribe = navigation.addListener("focus", loadHistory);

        return unsubscribe;

    }, []);
    return (
        <View style={{ flex: 1 }}>
            <Button

                title="Очистить историю"

                onPress={async () => {

                    await save("recent", []);

                    setHistory([]);

                }}

            />
            <FlatList

                data={history}

                keyExtractor={item => item.id}

                renderItem={({ item }) => (

                    <PressableCard

                        onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}

                    >

                        <RecipeCard recipe={item} />

                    </PressableCard>
                )}
            />
        </View>
    );
}