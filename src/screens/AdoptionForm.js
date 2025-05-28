import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import decodeJWT from '../services/decodeJWT';

const AdoptionForm = () => {
  const route = useRoute();
  const { petId } = route.params;

  const navigation = useNavigation();

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    idade: "",
    residencia: "",
    outrosAnimais: "",
    castrados: "",
    permiteAnimais: "",
    condominioPermite: "",
    acordoAdocao: "",
    areasAbertas: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const token = await AsyncStorage.getItem("token");
    const decoded = decodeJWT(token);
    const userId = decoded.id;

    try {
      const response = await fetch(
        `https://petfinder-l00r.onrender.com/adoptions`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            petId,
            userId: userId,
            formResponse: JSON.stringify(form)
          }),
        }
      );
      if (!response.ok) throw new Error("Falha ao enviar formulário");
      
      Alert.alert("Formúlario enviado com sucesso! ", response.text);
    } catch (error) {
      Alert.alert("Erro ao enviar formulário: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={24} color="#FF6B00" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Adoções</Text>
                  <View style={{ width: 24 }} /> 
                </View>
          <View style={styles.contentHeader}>
            <Ionicons name="paw-outline" size={32} color="#003366" />
            <View>
              <Text style={styles.contentHeaderTitle}>Formulário de Adoção</Text>
              <Text style={styles.contentHeaderSubtitle}>Preencha com seus dados</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                value={form.nome}
                onChangeText={(v) => handleChange("nome", v)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                value={form.telefone}
                onChangeText={(v) => handleChange("telefone", v)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Idade</Text>
              <TextInput
                style={styles.input}
                placeholder="Sua idade"
                keyboardType="numeric"
                value={form.idade}
                onChangeText={(v) => handleChange("idade", v)}
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Sobre sua Residência</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo de Residência</Text>
              <TextInput
                style={styles.input}
                placeholder="Casa, apartamento, etc."
                value={form.residencia}
                onChangeText={(v) => handleChange("residencia", v)}
              />
            </View>

            <RadioGroup
              label="Existem outros animais na residência?"
              selected={form.outrosAnimais}
              onSelect={(v) => handleChange("outrosAnimais", v)}
            />

            {form.outrosAnimais === "Sim" && (
              <RadioGroup
                label="Todos os animais são castrados?"
                selected={form.castrados}
                onSelect={(v) => handleChange("castrados", v)}
              />
            )}

            <RadioGroup
              label="Se alugada, o condomínio permite animais?"
              selected={form.condominioPermite}
              onSelect={(v) => handleChange("condominioPermite", v)}
            />

            <RadioGroup
              label="Todas as pessoas estão de acordo com a adoção?"
              selected={form.acordoAdocao}
              onSelect={(v) => handleChange("acordoAdocao", v)}
            />

            <RadioGroup
              label="Sua residência possui áreas abertas?"
              selected={form.areasAbertas}
              onSelect={(v) => handleChange("areasAbertas", v)}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="paw"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Enviar Solicitação</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const RadioGroup = ({ label, selected, onSelect }) => (
  <View style={styles.radioContainer}>
    <Text style={styles.radioLabel}>{label}</Text>
    <View style={styles.radioGroup}>
      <TouchableOpacity
        style={[
          styles.radioOption,
          selected === "Sim" && styles.radioOptionSelected,
        ]}
        onPress={() => onSelect("Sim")}
      >
        <Ionicons
          name={selected === "Sim" ? "radio-button-on" : "radio-button-off"}
          size={20}
          color={selected === "Sim" ? "#ff6600" : "#666"}
        />
        <Text
          style={[
            styles.radioText,
            selected === "Sim" && styles.radioTextSelected,
          ]}
        >
          Sim
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.radioOption,
          selected === "Não" && styles.radioOptionSelected,
        ]}
        onPress={() => onSelect("Não")}
      >
        <Ionicons
          name={selected === "Não" ? "radio-button-on" : "radio-button-off"}
          size={20}
          color={selected === "Não" ? "#ff6600" : "#666"}
        />
        <Text
          style={[
            styles.radioText,
            selected === "Não" && styles.radioTextSelected,
          ]}
        >
          Não
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  contentHeaderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#003366",
  },
  contentHeaderSubtitle: {
    fontSize: 14,
    marginLeft: 15,
    color: "#666",
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
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
  radioContainer: {
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#003366",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  radioOptionSelected: {
    backgroundColor: "#fff5f0",
    borderColor: "#ff6600",
  },
  radioText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#666",
  },
  radioTextSelected: {
    color: "#ff6600",
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6600",
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
    shadowColor: "#ff6600",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
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
  }
});

export default AdoptionForm;
