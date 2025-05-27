import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";

export default function RegisterScreen () {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [cpf, setCpf] = useState('')

    const navigation = useNavigation();

    const handleSubmit = async () => {
  // Validação básica
  if (!name || !email || !password || !phone || !cpf) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const response = await axios.post('https://petfinder-l00r.onrender.com/auth/register', {
      name,
      email,
      password,
      phone,
      cpf
    });

    alert("Cadastro bem-sucedido: ", response.data);
    navigation.navigate('Login'); // Ou para onde deve ir após cadastro
  } catch (error) {
    console.error("Erro detalhado:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    alert(
      error.response?.data?.message || 
      "Erro ao cadastrar. Verifique os dados e tente novamente."
    );
  }
}

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'handled'}>
            <Image style={styles.image} source={require('../../assets/imageHome1.png')} />
            <Text style={styles.title}>Criando sua Conta</Text>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={'Digite seu nome'}/>
                </View>
                 <View style={styles.inputContainer}>
                    <Text style={styles.label}>CPF</Text>
                    <TextInput style={styles.input} value={cpf} onChangeText={setCpf} placeholder={'Digite sua CPF'}/>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder={'Digite seu Email'}/>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder={'Digite seu Telefone'}/>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput style={styles.input} isPassword={true} value={password} secureTextEntry={true} onChangeText={setPassword} placeholder={'Digite sua senha'}/>
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#75C0F8',
        alignItems: "center",
    },
    image: {
        width: 300,
        height: 300,
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontWeight: '900',
    },
    formContainer: {
        flex: 1,
        alignItems: "center",
        width: 320,
        flexDirection: 'column',
        marginTop: 20,
    },
    input: {
        borderBottomColor: '#fff',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        width: 320,
        color: 'black',
        fontSize: 15,
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
        marginBottom: 60,
        marginTop: 25,
        width: 150,
        paddingVertical: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})