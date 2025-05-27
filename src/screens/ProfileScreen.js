import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function decodeJWT(token) {
  if (!token) return null;
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(base64);
  return JSON.parse(decoded);
}

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setCpf(data.cpf)
      } catch (err) {
        console.error('Erro ao carregar perfil', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = async () => {
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
        throw new Error('Erro ao atualizar perfil', response.datac);
      }

      const updated = await response.json();
      setUser(updated);
      Alert.alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil', err);
      Alert.alert('Erro ao atualizar perfil');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6B00" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.sectionTitle}>Editar Perfil</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Telefone" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" readOnly/>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} placeholder="CPF" readOnly/>

      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>EDITAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#75C0F8',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginTop: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  location: {
    color: '#333',
    marginBottom: 20,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    color: '#FF6B00',
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    elevation: 3,
  },
  button: {
    backgroundColor: '#FF6B00',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
