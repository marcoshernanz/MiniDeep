import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import getColor from "@/lib/utils/getColor";
import React from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
  buttonVariant?: "primary" | "destructive";
  title: string;
  content: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AlertDialog({
  visible,
  buttonVariant = "primary",
  title,
  content,
  confirmText = "OK",
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.dialog} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{content}</Text>
          <View style={styles.buttons}>
            <Button
              variant="secondary"
              pressableStyle={styles.pressable}
              onPress={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant={buttonVariant}
              pressableStyle={styles.pressable}
              onPress={onConfirm}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: Dimensions.get("window").width - 32,
    backgroundColor: getColor("background"),
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: getColor("border"),
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
  },
  message: {
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  pressable: {
    paddingVertical: 10,
  },
});
