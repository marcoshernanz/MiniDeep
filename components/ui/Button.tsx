import Text from "@/components/ui/Text";
import getColor from "@/lib/utils/getColor";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  Platform,
} from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

interface ButtonProps extends Omit<PressableProps, "style"> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pressableStyle?: StyleProp<ViewStyle>;
  text?: boolean;
  ref?: React.Ref<React.ComponentRef<typeof Pressable>>;
}

export default function Button({
  variant = "primary",
  children,
  containerStyle,
  pressableStyle,
  textStyle,
  text = true,
  ref,
  ...props
}: ButtonProps) {
  const rippleColor =
    variant === "primary"
      ? getColor("background", 0.25)
      : variant === "secondary"
      ? getColor("secondaryForeground", 0.1)
      : variant === "destructive"
      ? getColor("background", 0.25)
      : getColor("muted");

  return (
    <View style={[styles.wrapperView, containerStyle]}>
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          styles.baseButton,
          styles[`${variant}Button`],
          Platform.OS === "ios" && pressed && { opacity: 0.675 },
          pressableStyle,
        ]}
        android_ripple={{ color: rippleColor }}
        {...props}
      >
        {text ? (
          <Text style={[styles.baseText, styles[`${variant}Text`], textStyle]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperView: {
    overflow: "hidden",
    borderRadius: 8,
  },
  baseButton: {
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: getColor("primary"),
  },
  secondaryButton: {
    backgroundColor: getColor("secondary"),
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: getColor("border"),
    backgroundColor: getColor("background"),
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  destructiveButton: {
    backgroundColor: getColor("destructive"),
  },

  baseText: {
    textAlign: "center",
    fontWeight: 600,
  },
  primaryText: {
    color: getColor("primaryForeground"),
  },
  secondaryText: {
    color: getColor("secondaryForeground"),
  },
  outlineText: {
    color: getColor("foreground"),
  },
  ghostText: {
    color: getColor("foreground"),
  },
  destructiveText: {
    color: getColor("destructiveForeground"),
  },
});
