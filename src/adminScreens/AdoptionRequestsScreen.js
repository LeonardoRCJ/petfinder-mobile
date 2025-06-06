import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AdoptionRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

 
  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        "https://petfinder-l00r.onrender.com/adoptions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      setRequests(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAdoptionStatusUpdate = async (newStatus) => {
    if (!selectedRequest) return;

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `https://petfinder-l00r.onrender.com/adoptions/${selectedRequest.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      const data = await response.json();

      fetchAdoptionRequests();
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleAdoptionStatusApproved = () =>
    handleAdoptionStatusUpdate("APPROVED");
  const handleAdoptionStatusRejected = () =>
    handleAdoptionStatusUpdate("REJECTED");

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdoptionRequests();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "#4CAF50"; // Verde
      case "REJECTED":
        return "#F44336"; // Vermelho
      default:
        return "#FFA500"; // Laranja
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Aprovado";
      case "REJECTED":
        return "Rejeitado";
      default:
        return "Pendente";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedRequest(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.pet.image_url }} style={styles.petImage} />
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.petName}>{item.pet.petname}</Text>
          <Text style={styles.petType}>{item.pet.specie}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.user.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Adoções</Text>
        <View style={{ width: 24 }} /> 
      </View>
      <View style={styles.contentHeader}>
        <Ionicons name="list-outline" size={28} color="#003366" />
        <Text style={styles.ContentHeaderText}>Pedidos de Adoção</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6600" />
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
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
              <Ionicons name="paw-outline" size={50} color="#003366" />
              <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
            </View>
          }
        />
      )}

      {/* Modal de Detalhes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRequest && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalhes do Pedido</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-outline" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.petInfo}>
                  <Image
                    source={{ uri: selectedRequest.pet.image_url }}
                    style={styles.modalPetImage}
                  />
                  <View>
                    <Text style={styles.modalPetName}>
                      {selectedRequest.pet.petname}
                    </Text>
                    <Text style={styles.modalPetType}>
                      {selectedRequest.pet.specie}
                    </Text>
                    <View
                      style={[
                        styles.modalStatusBadge,
                        {
                          backgroundColor: getStatusColor(
                            selectedRequest.status
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.modalStatusText}>
                        {getStatusText(selectedRequest.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Solicitante</Text>
                  <Text style={styles.detailText}>
                    {selectedRequest.user.name}
                  </Text>
                  <Text style={styles.detailText}>
                    {selectedRequest.user.email}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Respostas do Formulário
                  </Text>
                  <View style={styles.formResponse}>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>Nome:</Text>{" "}
                      {selectedRequest.formResponse.nome}
                    </Text>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>Email:</Text>{" "}
                      {selectedRequest.formResponse.email}
                    </Text>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>Idade:</Text>{" "}
                      {selectedRequest.formResponse.idade}
                    </Text>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>Telefone:</Text>{" "}
                      {selectedRequest.formResponse.telefone}
                    </Text>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>
                        Parentes concordam com a adoção?:
                      </Text>{" "}
                      {selectedRequest.formResponse.acordoAdocao}
                    </Text>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>
                        Sua residência tem aréas abertas?:
                      </Text>{" "}
                      {selectedRequest.formResponse.areasAbertas}
                    </Text>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>Residência:</Text>{" "}
                      {selectedRequest.formResponse.residencia}
                    </Text>
                    <Text style={styles.responseItem}>
                      <Text style={styles.responseLabel}>Outros animais:</Text>{" "}
                      {selectedRequest.formResponse.outrosAnimais}
                    </Text>

                    {selectedRequest.formResponse.outrosAnimais === "Sim" && (
                      <Text style={styles.responseItem}>
                        <Text style={styles.responseLabel}>São castrados:</Text>{" "}
                        {selectedRequest.formResponse.castrados}
                      </Text>
                    )}
                    {/* Adicionar mais campos conforme necessário */}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Data do Pedido</Text>
                  <Text style={styles.detailText}>
                    {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleAdoptionStatusUpdate("REJECTED")}
                  >
                    <Text style={styles.buttonText}>Rejeitar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleAdoptionStatusUpdate("APPROVED")}
                  >
                    <Text style={styles.buttonText}>Aprovar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  ContentHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#003366",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  cardHeaderInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003366",
  },
  petType: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  cardBody: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    maxHeight: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
  },
  petInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalPetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  modalPetName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
  },
  modalPetType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  modalStatusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  modalStatusText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  formResponse: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
  },
  responseItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  responseLabel: {
    fontWeight: "bold",
    color: "#003366",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: {
    backgroundColor: "#f8d7da",
    marginRight: 10,
  },
  approveButton: {
    backgroundColor: "#d4edda",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
});

export default AdoptionRequestsScreen;
