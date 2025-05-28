import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const FeedScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="#FF6B00" />
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
  }, [pets]);

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
      <View style={styles.petImageContainer}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.petImage}
          resizeMode="cover"
        />
        <View style={styles.petNameOverlay}>
          <Text style={styles.petName}>{item.petname?.toUpperCase() || 'PET'}</Text>
        </View>
      </View>
      
      <View style={styles.petInfoContainer}>
        <Text numberOfLines={2} style={styles.petDescription}>
          {item.description || 'Descrição não informada'}
        </Text>
        
        <View style={styles.petMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="paw" size={16} color="#FF6B00" />
            <Text style={styles.metaText}>{item.breed || 'Raça não informada'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={16} color="#FF6B00" />
            <Text style={styles.metaText}>{item.age || '?'} anos</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleConhecer(item)}>
            <Text style={styles.buttonText}>Conhecer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleAdotar(item)}>
            <Text style={styles.buttonText}>Adotar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logoHeader.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>Bem-vindo de volta</Text>
          <Text style={styles.headerTitle}>Aumigo!
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowMenu(true)}
          style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMenu(false)}>
        <View style={styles.menuOverlay}>
          <Pressable 
            style={styles.menuBackdrop}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <Ionicons name="close" size={24} color="#FF6B00" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('Profile');
                  setShowMenu(false);
                }}>
                <Ionicons name="person" size={20} color="#FF6B00" />
                <Text style={styles.menuItemText}>Meu Perfil</Text>
              </TouchableOpacity>
               <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('MyAdoptionsRequests');
                  setShowMenu(false);
                }}>
                <Ionicons name="alert" size={20} color="#FF6B00" />
                <Text style={styles.menuItemText}>Minhas Solicitações</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('About');
                  setShowMenu(false);
                }}>
                <Ionicons name="information-circle" size={20} color="#FF6B00" />
                <Text style={styles.menuItemText}>Sobre Nós</Text>
              </TouchableOpacity>
             
            </ScrollView>
            
            <TouchableOpacity
              style={styles.menuFooter}
              onPress={logout}>
              <Ionicons name="exit-outline" size={20} color="#FF6B00" />
              <Text style={styles.menuItemText}>Sair</Text>
            </TouchableOpacity>

            
          </View>
        </View>
      </Modal>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Procure por nome ou raça..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
        ) : filteredPets.length > 0 ? (
          <FlatList
            data={filteredPets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPetItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="paw" size={48} color="#FF6B00" />
            <Text style={styles.noResultsText}>Nenhum pet encontrado</Text>
            <Text style={styles.noResultsSubtext}>Tente ajustar sua busca</Text>
          </View>
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
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {selectedPet && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedPet.petname}</Text>
                    <TouchableOpacity 
                      style={styles.modalCloseButton}
                      onPress={() => setShowDetailsModal(false)}>
                      <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  
                  <Image
                    source={{ uri: selectedPet.image_url }}
                    style={styles.modalImage}
                  />
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="paw" size={20} color="#FF6B00" />
                    <Text style={styles.detailText}>Raça: {selectedPet.breed || 'Não informada'}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={20} color="#FF6B00" />
                    <Text style={styles.detailText}>Idade: {selectedPet.age || '?'} anos</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="happy" size={20} color="#FF6B00" />
                    <Text style={styles.detailText}>Temperamento: {selectedPet.temperament || 'Não informado'}</Text>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Sobre</Text>
                    <Text style={styles.modalText}>
                      {selectedPet.description || 'Descrição não disponível.'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.adoptButton}
                    onPress={() => {
                      setShowDetailsModal(false);
                      handleAdotar(selectedPet);
                    }}>
                    <Text style={styles.adoptButtonText}>Quero adotar!</Text>
                  </TouchableOpacity>
                </>
              )}
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
          <View style={[styles.modalContainer, styles.adoptModal]}>
            <Ionicons name="heart" size={48} color="#FF6B00" style={styles.adoptIcon} />
            <Text style={styles.modalTitle}>Confirmar Adoção</Text>
            {selectedPet && (
              <Text style={styles.modalText}>
                Deseja adotar <Text style={styles.petNameHighlight}>{selectedPet.petname}</Text>?
              </Text>
            )}
            
            <View style={styles.adoptModalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowAdoptModal(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  navigation.navigate('AdoptionForm', {petId: selectedPet.id})
                  setShowAdoptModal(false);
                }}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F8FAFC',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  logo: {
    width: 48,
    height: 48,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  menuButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 8,
    marginRight: 8,
  },
  
  // Search
  searchContainer: {
    padding: 16,
    backgroundColor: '#b3e5ff ',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
  },
  
  // Content
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  
  // Pet Card
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  petImageContainer: {
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 350,
  },
  petNameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  petInfoContainer: {
    padding: 16,
  },
  petDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  petMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#FF6B00',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Menu
  menuOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  menuBackdrop: {
    flex: 1,
  },
  menuContainer: {
    width: '75%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  menuFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalScroll: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#4B5563',
    marginLeft: 8,
  },
  detailSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  adoptButton: {
    backgroundColor: '#FF6B00',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  adoptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Adopt Modal
  adoptModal: {
    padding: 24,
    alignItems: 'center',
  },
  adoptIcon: {
    marginBottom: 16,
  },
  petNameHighlight: {
    color: '#FF6B00',
    fontWeight: '600',
  },
  adoptModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#FF6B00',
    flex: 1,
    marginLeft: 8,
  },
});

export default FeedScreen;