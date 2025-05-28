import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const ViewAllPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petname: '',
    age: '',
    description: '',
    type: ''
  });

  const navigation = useNavigation();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://petfinder-l00r.onrender.com/pets");
      const data = await response.json();
      setPets(data);
    } catch (err) {
      console.error('Erro ao carregar pets ', err);
      Alert.alert('Erro', 'Não foi possível carregar os pets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPets();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredPets = pets.filter(pet =>
    pet.petname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.age.toString().includes(searchQuery)
  );

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setFormData({
      petname: pet.petname,
      age: pet.age.toString(),
      description: pet.health_condition,
      type: pet.specie
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = async (petId) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este pet?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Excluir", 
          onPress: async () => {
            try {
              const response = await fetch(`https://petfinder-l00r.onrender.com/pets/${petId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
              
              Alert.alert('Sucesso', 'Pet excluído com sucesso');
              fetchPets();
            } catch (err) {
              console.error('Erro ao excluir pet: ', err);
              Alert.alert('Erro', 'Não foi possível excluir o pet');
            }
          } 
        }
      ]
    );
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://petfinder-l00r.onrender.com/pets/${selectedPet.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        })
      });
      
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      
      Alert.alert('Sucesso', 'Pet atualizado com sucesso');
      setModalVisible(false);
      fetchPets();
    } catch (err) {
      console.error('Erro ao atualizar pet: ', err);
      Alert.alert('Erro', 'Não foi possível atualizar o pet');
    }
  };

  const renderPet = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.image_url || 'https://placekitten.com/100/100' }} 
        style={styles.petImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.petName}>{item.petname}</Text>
        <View style={styles.petDetails}>
          <Text style={styles.petDetail}>
            <Ionicons name="paw-outline" size={14} color="#666" /> {item.type}
          </Text>
          <Text style={styles.petDetail}>
            <Ionicons name="time-outline" size={14} color="#666" /> {item.age} anos
          </Text>
        </View>
        <Text style={styles.petDescription} numberOfLines={2}>
          {item.description}
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
                  onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#FF6B00" />
                </TouchableOpacity>
              <Text styles={styles.headerTitle}>Catálogo de Pets</Text>
                <View style={{ width: 24 }} /> {/* Espaço para alinhamento */}
              </View>
      <View style={styles.aboutHeader}>
        <View style={styles.headerContent}>
          <Ionicons name="paw-outline" size={28} color="#003366" />
          <Text style={styles.headerText}>
            Gerenciamento de Pets
          </Text>
        </View>
        <Text style={styles.adminWelcome}>Bem-vindo, Administrador</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar pets..."
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
          data={filteredPets}
          renderItem={renderPet}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#ff6600']}
              tintColor="#ff6600"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={50} color="#003366" />
              <Text style={styles.emptyText}>Nenhum pet encontrado</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Editar Pet' : 'Detalhes do Pet'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do pet"
              value={formData.petname}
              onChangeText={(text) => setFormData({...formData, petname: text})}
              editable={editMode}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={formData.age}
              onChangeText={(text) => setFormData({...formData, age: text})}
              editable={editMode}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Tipo (cachorro, gato, etc)"
              value={formData.type}
              onChangeText={(text) => setFormData({...formData, type: text})}
              editable={editMode}
            />
            
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descrição"
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              editable={editMode}
              multiline
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

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 25,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  aboutHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#003366',
  },
  adminWelcome: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
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
    color: '#333',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 5,
  },
  petDetails: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  petDetail: {
    fontSize: 13,
    color: '#666',
    marginRight: 15,
  },
  petDescription: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#ff6600',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#ff6600',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerTitle: {

  }
});

export default ViewAllPets;