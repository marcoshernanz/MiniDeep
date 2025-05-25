import React from "react";
import { View } from "react-native";
import { Card } from "../ui/card";

interface Props {
  children: React.ReactNode;
}

export default function SettingsGroup({ children }: Props) {
  const items = React.Children.toArray(children);

  return (
    <Card className="overflow-hidden">
      {items.map((child, index) => (
        <View
          key={index}
          className={index < items.length - 1 ? "border-b border-border" : ""}
        >
          {child}
        </View>
      ))}
    </Card>
  );
}
