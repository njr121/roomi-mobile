import { Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export function GradientButton({ label, onPress, disabled, className }: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} className={className}>
      <LinearGradient
        colors={["#0284c7", "#38bdf8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          minHeight: 44,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text className="font-semibold text-white">{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
