import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../lib/constant";
import { Todo } from "../store/useTodoStore";

interface TodoItemProps {
  item: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onToggle, onDelete }) => (
  <View style={styles.row}>
    <Pressable
      style={[
        styles.checkbox,
        item.is_done && { backgroundColor: COLORS.primary },
      ]}
      onPress={() => onToggle(item)}
    >
      {item.is_done && <Text style={styles.tick}>✓</Text>}
    </Pressable>

    <Text
      style={[
        styles.text,
        item.is_done && { textDecorationLine: "line-through", opacity: 0.5 },
      ]}
    >
      {item.description}
    </Text>

    <TouchableOpacity onPress={() => onDelete(item.id)}>
      <Text style={styles.trash}>🗑</Text>
    </TouchableOpacity>
  </View>
);

export default React.memo(
  TodoItem,
  (prev, next) =>
    prev.item.is_done === next.item.is_done &&
    prev.item.description === next.item.description
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  tick: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: "700",
    marginTop: -2,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  trash: {
    fontSize: 20,
    color: COLORS.danger,
    paddingHorizontal: 8,
  },
});
