import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import useTodoStore, { Todo } from "../store/useTodoStore";
import { COLORS } from "../lib/constant";
import TodoItem from "../components/TodoItem";
import AddTodoModal from "../components/AddTodoModal";

interface TodoScreenProps {
  userId: number;
  onLogout: () => void;
}

const TodoScreen: React.FC<TodoScreenProps> = ({ userId, onLogout }) => {
  const {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clear,
  } = useTodoStore();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTodos(userId);
  }, [userId, fetchTodos]);

  useEffect(() => {
    if (error) Alert.alert("Error", error);
  }, [error]);

  const handleAdd = async (desc: string) => {
    if (!desc) {
      Alert.alert("Peringatan", "Deskripsi tidak boleh kosong.");
      return;
    }
    await addTodo(userId, desc);
    setShowModal(false);
  };

  const handleToggle = (t: Todo) => toggleTodo(t.id, !t.is_done);
  const handleDelete = (id: number) =>
    Alert.alert("Konfirmasi", "Hapus todo ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => deleteTodo(id) },
    ]);

  const handleLogout = () => {
    clear();
    onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Todo</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TodoItem
              item={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada todo.</Text>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <AddTodoModal
        visible={showModal}
        onConfirm={handleAdd}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 16,
    color: "#64748B",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabIcon: {
    color: COLORS.buttonText,
    fontSize: 32,
    lineHeight: 36,
  },
  logoutBtn: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "600",
  },
});
