import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import MaskInput from 'react-native-mask-input';

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name || !email || !password || !phone || !cpf) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://petfinder-l00r.onrender.com/auth/register",
        {
          name,
          email,
          password,
          phone: phone.replace(/\D/g, ''), // Remove máscara
          cpf: cpf.replace(/\D/g, '') // Remove máscara
        }
      );

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (error) {
      console.error("Erro detalhado:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Erro ao cadastrar. Verifique os dados e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Image
            style={styles.logo}
            source={require("../../assets/imageHome1.png")}
            resizeMode="contain"
          />

          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>CPF</Text>
              <MaskInput
                style={styles.input}
                value={cpf}
                onChangeText={(masked, unmasked) => setCpf(masked)}
                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                placeholder="000.000.000-00"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Telefone</Text>
              <MaskInput
                style={styles.input}
                value={phone}
                onChangeText={(masked, unmasked) => setPhone(masked)}
                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                placeholderTextColor="#999"
                secureTextEntry={true}
              />
              <Text style={styles.passwordHint}>Mínimo 6 caracteres</Text>
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}> Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#75C0F8",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    width: '100%',
    color: '#fff',
    fontSize: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passwordHint: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6909',
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
  },
  loginLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});