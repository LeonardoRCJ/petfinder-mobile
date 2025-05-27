import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const FeedScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={{ marginRight: 10 }}>
          <Text style={{ color: '#FF6B00', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [search, setSearch] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const apiUrl = 'https://petfinder-l00r.onrender.com/pets';

    const getPets = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setPets(data);
      } catch (err) {
        console.error('Erro ao carregar os pets: ', err);
      } finally {
        setLoading(false);
      }
    };

    getPets();
  }, []);

  const filteredPets = pets.filter(
    (pet) =>
      pet.petname?.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(search.toLowerCase())
  );

  const handleConhecer = (pet) => {
    setSelectedPet(pet);
    setShowDetailsModal(true);
  };

  const handleAdotar = (pet) => {
    setSelectedPet(pet);
    setShowAdoptModal(true);
  };

  const renderPetItem = ({ item }) => (
    <View style={styles.petCard}>
      <Text style={styles.petName}>{item.petname?.toUpperCase() || 'PET'}</Text>
      <Image
        source={{ uri: item.image_url }}
        style={styles.petImage}
        resizeMode="cover"
      />
      <Text numberOfLines={3} style={styles.petDescription}>
        {item.description || 'Descrição não informada'}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleConhecer(item)}>
          <Text style={styles.buttonText}>Conhecer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAdotar(item)}>
          <Text style={styles.buttonText}>Adotar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logoHeader.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Olá, Leonardo!</Text>

        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMenu(false)}>
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>MENU</Text>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                navigation.navigate('Login')
              }}>
              <Text style={styles.menuButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                navigation.navigate('Profile')
              }}>
              <Text style={styles.menuButtonText}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                /* navega para Cadastro */
              }}>
              <Text style={styles.menuButtonText}>Cadastro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                navigation.navigate('aboutus')
              }}>
              <Text style={styles.menuButtonText}>Sobre Nós</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowMenu(false)}>
              <Text style={styles.menuButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Procure aqui..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" style={styles.loader} />
        ) : filteredPets.length > 0 ? (
          <FlatList
            data={filteredPets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPetItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.noResultsText}>Nenhum pet encontrado</Text>
        )}
      </View>

      {/* Modal de Detalhes */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailsModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              {selectedPet && (
                <>
                  <Text style={styles.modalTitle}>{selectedPet.petname}</Text>
                  <Image
                    source={{ uri: selectedPet.image_url }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalText}>
                    Raça: {selectedPet.breed}
                  </Text>
                  <Text style={styles.modalText}>
                    Idade: {selectedPet.age} anos
                  </Text>
                  <Text style={styles.modalText}>
                    Temperamento: {selectedPet.temperament}
                  </Text>
                  <Text style={styles.modalText}>
                    Descrição: {selectedPet.description}
                  </Text>
                </>
              )}
              <Pressable
                style={styles.modalButton}
                onPress={() => setShowDetailsModal(false)}>
                <Text style={styles.buttonText}>Fechar</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Adoção */}
      <Modal
        visible={showAdoptModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAdoptModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Adoção</Text>
            {selectedPet && (
              <Text style={styles.modalText}>
                Deseja adotar {selectedPet.petname}?
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  alert('Solicitação enviada!');
                  setShowAdoptModal(false);
                }}>
                <Text style={styles.buttonText}>Sim</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => setShowAdoptModal(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#EAF6FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    elevation: 4,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#75C0F8',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    width: '90%',
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 15,
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  petDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noResultsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
    color: '#555',
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  menuIcon: {
    fontSize: 28,
    color: '#FF6B00',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '60%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#FF6B00',
    padding: 12,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
