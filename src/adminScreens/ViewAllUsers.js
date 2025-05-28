import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
  });

  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://petfinder-l00r.onrender.com/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários: ", err);
      Alert.alert("Erro", "Não foi possível carregar os usuários");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.cpf.includes(searchQuery)
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      cpf: user.cpf,
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = async (userId) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este usuário?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(
                `https://petfinder-l00r.onrender.com/users/${userId}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!response.ok)
                throw new Error(`Erro HTTP: ${response.status}`);

              Alert.alert("Sucesso", "Usuário excluído com sucesso");
              fetchUsers();
            } catch (err) {
              console.error("Erro ao excluir usuário: ", err);
              Alert.alert("Erro", "Não foi possível excluir o usuário");
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `https://petfinder-l00r.onrender.com/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      Alert.alert("Sucesso", "Usuário atualizado com sucesso");
      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      console.error("Erro ao atualizar usuário: ", err);
      Alert.alert("Erro", "Não foi possível atualizar o usuário");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={40} color="#003366" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.userDetail} numberOfLines={1}>
          <Ionicons name="mail-outline" size={14} color="#666" /> {item.email}
        </Text>
        <Text style={styles.userDetail} numberOfLines={1}>
          <Ionicons name="id-card-outline" size={14} color="#666" /> {item.cpf}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={22} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#ff6600" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FF6B00" />
        </TouchableOpacity>
        <Text style={styles.title}>Sobre Nós</Text>
        <View style={{ width: 24 }} /> {/* Espaço para alinhamento */}
      </View>
      <View style={styles.aboutHeader}>
        <View style={styles.headerContent}>
          <Ionicons name="people-outline" size={28} color="#003366" />
          <Text style={styles.headerText}>Gerenciamento de Usuários</Text>
        </View>
        <Text style={styles.adminWelcome}>Bem-vindo, Administrador</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar usuários..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6600" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#ff6600"]}
              tintColor="#ff6600"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={50} color="#003366" />
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
            </View>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? "Editar Usuário" : "Detalhes do Usuário"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              editable={editMode}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="CPF"
              value={formData.cpf}
              onChangeText={(text) => setFormData({ ...formData, cpf: text })}
              editable={editMode}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              {editMode && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdate}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
    paddingTop: 20,
  },
  aboutHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#003366",
  },
  adminWelcome: {
    fontSize: 14,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: "#333",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarContainer: {
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 5,
  },
  userDetail: {
    fontSize: 13,
    color: "#666",
    marginBottom: 3,
  },
  actions: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#ff6600",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ViewAllUsers;
