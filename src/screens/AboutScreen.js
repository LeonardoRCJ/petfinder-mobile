import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AboutScreen = () => {
  const navigation = useNavigation();
  
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
          <Text style={styles.title}>Sobre Nós</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: "https://res.cloudinary.com/dztwemikt/image/upload/v1748378783/1_3_cl0uhi.png",
              }}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>Nossa História</Text>
            <Text style={styles.text}>
              A PetFinder nasceu da ideia de ajudar os muitos pets que não têm um lar. 
              Somos movidos pela paixão por animais e pelo desejo de fazer a diferença 
              na vida desses companheiros.
            </Text>

            <Text style={styles.subtitle}>Nossa Missão</Text>
            <Text style={styles.text}>
              Conectar potenciais donos com o pet ideal, criando lares felizes e 
              responsáveis. Acreditamos que cada animal merece amor e cuidado.
            </Text>

            <Text style={styles.subtitle}>Como Funciona</Text>
            <Text style={styles.text}>
              Em nossa plataforma, você pode cadastrar pets para adoção ou encontrar 
              seu novo companheiro. Facilitamos todo o processo para que a adoção 
              seja segura e transparente.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('UserFeed')}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Quero adotar</Text>
            <Ionicons name="paw" size={18} color="#FFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    width: '100%',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B00',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: "#FF6B00",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default AboutScreen;