import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
    type: '',
    breed: '',
    color: '',
    energy_level: '',
    estimated_weight: '',
    gender: '',
    health_condition: '',
    is_castrated: false,
    is_dewormed: false,
    is_good_with_kids: false,
    is_good_with_other_dogs: false,
    is_vaccinated: false,
    last_consultation_date: '',
    size: '',
    specie: '',
    temperament: ''
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
    pet.specie.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.age.toString().includes(searchQuery)
  );

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setFormData({
      petname: pet.petname || '',
      age: pet.age?.toString() || '',
      description: pet.description || '',
      breed: pet.breed || '',
      color: pet.color || '',
      energy_level: pet.energy_level?.toString() || '',
      estimated_weight: pet.estimated_weight?.toString() || '',
      gender: pet.gender || '',
      health_condition: pet.health_condition || '',
      is_castrated: pet.is_castrated || false,
      is_dewormed: pet.is_dewormed || false,
      is_good_with_kids: pet.is_good_with_kids || false,
      is_good_with_other_dogs: pet.is_good_with_other_dogs || false,
      is_vaccinated: pet.is_vaccinated || false,
      last_consultation_date: pet.last_consultation_date || '',
      size: pet.size || '',
      specie: pet.specie || '',
      temperament: pet.temperament || ''
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = async (petId) => {
    const token = await AsyncStorage.getItem('token');
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
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://petfinder-l00r.onrender.com/pets/${selectedPet.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          energy_level: formData.energy_level,
          estimated_weight: parseFloat(formData.estimated_weight),
          is_castrated: !!formData.is_castrated,
          is_dewormed: !!formData.is_dewormed,
          is_good_with_kids: !!formData.is_good_with_kids,
          is_good_with_other_dogs: !!formData.is_good_with_other_dogs,
          is_vaccinated: !!formData.is_vaccinated,
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
            <Ionicons name="paw-outline" size={14} color="#666" /> {item.specie}
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
        <Text style={styles.headerTitle}>Catálogo de Pets</Text>
        <View style={{ width: 24 }} /> 
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

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateNewPet')}>
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
              value={formData.specie}
              onChangeText={(text) => setFormData({...formData, type: text})}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Raça"
              value={formData.breed}
              onChangeText={(text) => setFormData({...formData, breed: text})}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Cor"
              value={formData.color}
              onChangeText={(text) => setFormData({...formData, color: text})}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Nível de energia"
              value={formData.energy_level}
              onChangeText={(text) => setFormData({...formData, energy_level: text})}
              editable={editMode}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Peso estimado"
              value={formData.estimated_weight}
              onChangeText={(text) => setFormData({...formData, estimated_weight: text})}
              editable={editMode}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Gênero"
              value={formData.gender}
              onChangeText={(text) => setFormData({...formData, gender: text})}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Condição de saúde"
              value={formData.health_condition}
              onChangeText={(text) => setFormData({...formData, health_condition: text})}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Data da última consulta"
              value={formData.last_consultation_date.split("T")[0]}
              onChangeText={(text) => setFormData({...formData, last_consultation_date: date})}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Tamanho"
              value={formData.size}
              onChangeText={(text) => setFormData({...formData, size: text})}
              editable={editMode}
            />

            <TextInput
              style={styles.input}
              placeholder="Temperamento"
              value={formData.temperament}
              onChangeText={(text) => setFormData({...formData, temperament: text})}
              editable={editMode}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#003366' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              {editMode && (
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#ff6600' }]}
                  onPress={handleUpdate}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  aboutHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  adminWelcome: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  petName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#003366',
  },
  petDetails: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  petDetail: {
    marginRight: 15,
    fontSize: 13,
    color: '#666',
  },
  petDescription: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  iconButton: {
    marginVertical: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#ff6600',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#003366',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default ViewAllPets;
