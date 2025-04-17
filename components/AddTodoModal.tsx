import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../lib/constant";

interface AddTodoModalProps {
  visible: boolean;
  onConfirm: (description: string) => void;
  onClose: () => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({
  visible,
  onConfirm,
  onClose,
}) => {
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (!visible) setDesc("");
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Tambah Todo</Text>

          <TextInput
            style={styles.input}
            placeholder="Deskripsi"
            placeholderTextColor="#94A3B8"
            value={desc}
            onChangeText={setDesc}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.primary }]}
              onPress={() => onConfirm(desc.trim())}
            >
              <Text style={styles.btnLabel}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.inputBg }]}
              onPress={onClose}
            >
              <Text style={[styles.btnLabel, { color: COLORS.text }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTodoModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "85%",
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 12,
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.buttonText,
  },
});
