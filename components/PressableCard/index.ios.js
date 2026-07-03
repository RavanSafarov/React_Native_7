import { Pressable } from "react-native";

const PressableCard = ({ onPress, style, children }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [style, { opacity: pressed ? 0.6 : 1 }]}
    >
      {children}
    </Pressable>
  );
};

export default PressableCard;
