import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import decodeJWT from '../services/decodeJWT';

export default function AdminProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded = decodeJWT(token);
        const userId = decoded.id;

        const response = await fetch(`https://petfinder-l00r.onrender.com/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setUser(data);
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email);
        setCpf(data.cpf);
      } catch (err) {
        console.error('Erro ao carregar perfil', err);
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = async () => {
    if (!editing) {
      setEditing(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const decoded = decodeJWT(token);
      const userId = decoded.id;

      const response = await fetch(`https://petfinder-l00r.onrender.com/users/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      const updated = await response.json();
      setUser(updated);
      setEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil', err);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FF6B00" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <View style={{ width: 24 }} /> 
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{name}</Text>
          
          {editing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Ionicons name="camera" size={18} color="#FFF" />
              <Text style={styles.changePhotoText}>Alterar foto</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              editable={editing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput 
              style={styles.input} 
              value={phone} 
              onChangeText={setPhone} 
              editable={editing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput 
              style={[styles.input, styles.disabledInput]} 
              value={email} 
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CPF</Text>
            <TextInput 
              style={[styles.input, styles.disabledInput]} 
              value={cpf} 
              editable={false}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, editing ? styles.cancelButton : styles.editButton]}
            onPress={handleEdit}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {editing ? 'Cancelar' : 'Editar Perfil'}
            </Text>
          </TouchableOpacity>

          {editing && (
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleEdit}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },
  header: {
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
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  changePhotoText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  formContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#111827',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButton: {
    backgroundColor: '#FF6B00',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});