import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!email || !password) {
      return Alert.alert('Erro', 'Preencha todos os campos necessários');
    }

    try {
      const response = await axios.post(
        'https://petfinder-l00r.onrender.com/auth/login',
        {
          email,
          password,
        }
      );
      const data = response.data;

      if (data.token) {
        await login(data.token);
        setEmail('');
        setPassword('');

        Alert.alert('Sucesso', 'Login realizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Feed'),
          },
        ]);
      } else {
        Alert.alert('Erro', 'Erro no login');
      }
    } catch (err) {
      console.error('Erro detalhado:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      Alert.alert('Erro', 'Erro ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/imageHome1.png')}
        style={{ width: 300, height: 300 }}
      />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={'Digite seu Email'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={'Digite sua senha'}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#75C0F8',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    width: 320,
    flexDirection: 'column',
    marginTop: 20,
    gap: 20,
  },
  input: {
    borderBottomColor: '#fff',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    width: 320,
    color: 'black',
    fontSize: 15,
    padding: 5,
    outlineStyle: 'none',
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#FF6909',
    borderRadius: 15,
    marginTop: 20,
    width: 150,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
