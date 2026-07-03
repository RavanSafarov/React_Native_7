import { Pressable } from "react-native";

const PressableCard = ({ onPress, style, children }) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: "#dbeafe",
        foreground: true,
      }}
      style={style}
    >
      {children}
    </Pressable>
  );
};

export default PressableCard;
