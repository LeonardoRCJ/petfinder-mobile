import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInputMask } from 'react-native-masked-text';

const CreatePetScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      petname: '',
      age: '',
      specie: '',
      gender: '',
      breed: '',
      color: '',
      energy_level: '',
      estimated_weight: '',
      health_condition: '',
      size: '',
      temperament: '',
      last_consultation_date: '',
      is_castrated: false,
      is_dewormed: false,
      is_good_with_kids: false,
      is_good_with_other_dogs: false,
      is_vaccinated: false,
    }
  });

  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = async (data) => {
    if (!imageUri) {
      Alert.alert('Atenção', 'Por favor, adicione uma imagem do pet');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append fields
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }

      // Append image
      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          type: "image/jpeg",
          name: "pet.jpg",
        });
      }

      const token = await AsyncStorage.getItem("token");

      const response = await fetch("https://petfinder-l00r.onrender.com/pets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseText = await response.text();
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        result = responseText;
      }

      if (!response.ok) {
        let errorMessage = 'Erro ao cadastrar pet';
        if (result?.message) {
          errorMessage = result.message;
        } else if (result?.missingFields) {
          errorMessage = `Campos obrigatórios faltando: ${result.missingFields.join(', ')}`;
        }
        throw new Error(errorMessage);
      }

      Alert.alert('Sucesso', 'Pet cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
      reset();
      setImageUri(null);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const booleanFields = [
    { name: "is_castrated", label: "Castrado" },
    { name: "is_dewormed", label: "Vermifugado" },
    { name: "is_good_with_kids", label: "Bom com crianças" },
    { name: "is_good_with_other_dogs", label: "Bom com outros cães" },
    { name: "is_vaccinated", label: "Vacinado" },
  ];

  const textFields = [
    { 
      name: "petname", 
      label: "Nome do Pet*", 
      keyboardType: "default",
      rules: { required: 'Nome do pet é obrigatório' }
    },
    { 
      name: "age", 
      label: "Idade (anos)*", 
      keyboardType: "numeric",
      rules: { 
        required: 'Idade é obrigatória',
        min: { value: 0, message: 'Idade não pode ser negativa' }
      }
    },
    { 
      name: "specie", 
      label: "Espécie*", 
      keyboardType: "default",
      rules: { required: 'Espécie é obrigatória' }
    },
    { 
      name: "gender", 
      label: "Sexo*", 
      keyboardType: "default",
      rules: { required: 'Sexo é obrigatório' }
    },
    { name: "breed", label: "Raça", keyboardType: "default" },
    { name: "color", label: "Cor", keyboardType: "default" },
    { name: "energy_level", label: "Nível de Energia", keyboardType: "default" },
    { 
      name: "estimated_weight", 
      label: "Peso Estimado (kg)", 
      keyboardType: "numeric",
      rules: { min: { value: 0, message: 'Peso não pode ser negativo' } }
    },
    { name: "health_condition", label: "Condição de Saúde", keyboardType: "default" },
    { name: "size", label: "Porte", keyboardType: "default" },
    { name: "temperament", label: "Temperamento", keyboardType: "default" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Pet</Text>

      {/* Seção da Imagem */}
      <View style={styles.imageSection}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.petImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#003366" />
              <Text style={styles.imagePlaceholderText}>Adicionar Foto*</Text>
            </View>
          )}
        </TouchableOpacity>
        {!imageUri && (
          <Text style={styles.errorText}>Uma imagem do pet é obrigatória</Text>
        )}
      </View>

      {/* Seção de Informações Básicas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas*</Text>
        {textFields.slice(0, 4).map((field) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name}
            rules={field.rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                {field.name === 'age' || field.name === 'estimated_weight' ? (
                  <TextInputMask
                    type={'only-numbers'}
                    value={value}
                    onChangeText={onChange}
                    style={[styles.input, error && styles.errorInput]}
                    keyboardType={field.keyboardType}
                  />
                ) : (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.input, error && styles.errorInput]}
                    keyboardType={field.keyboardType}
                  />
                )}
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
        ))}
      </View>

      {/* Seção de Características */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Características</Text>
        {textFields.slice(4, 8).map((field) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name}
            rules={field.rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, error && styles.errorInput]}
                  keyboardType={field.keyboardType}
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
        ))}
      </View>

      {/* Seção de Saúde */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saúde</Text>
        {textFields.slice(8, 10).map((field) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  keyboardType={field.keyboardType}
                />
              </View>
            )}
          />
        ))}

        <Controller
          control={control}
          name="last_consultation_date"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Última Consulta</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  value={value}
                  style={styles.input}
                  editable={false}
                  placeholder="Selecione a data"
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      onChange(selectedDate.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}
            </View>
          )}
        />

        <View style={styles.checkboxContainer}>
          {booleanFields.map((field) => (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.checkboxItem}
                  onPress={() => onChange(!value)}
                >
                  <Ionicons
                    name={value ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color={value ? "#ff6600" : "#666"}
                  />
                  <Text style={styles.checkboxLabel}>{field.label}</Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </View>
      </View>

      {/* Seção de Temperamento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperamento</Text>
        <Controller
          control={control}
          name="temperament"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Temperamento</Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                style={styles.input}
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons name="paw" size={20} color="#fff" />
            <Text style={styles.buttonText}>Cadastrar Pet</Text>
          </View>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f5f9ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#003366",
    overflow: "hidden",
    elevation: 3,
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: "#003366",
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#003366",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#ff6600",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#ff6600",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default CreatePetScreen;