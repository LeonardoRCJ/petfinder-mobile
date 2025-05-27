import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre nós</Text>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: "https://res.cloudinary.com/dztwemikt/image/upload/v1748378783/1_3_cl0uhi.png",
          }}
        />
      </View>

      <Text style={styles.text}>
        A PetFinder nasceu da ideia de ajudar com muitos pets que não tem um
        lar.{" "}
      </Text>
      <Text style={styles.text}> Nossa missão é juntar potenciais donos com o pet ideal. </Text>
      <Text style={styles.text}>
        {" "}
        Em nossa plataforma, você pode cadastrar algum pet para adoção, ou
        também adotar..{" "}
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Quero adotar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#75C0F8",
  },
  button: {
    backgroundColor: "#FF6B00",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 30,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  imageContainer: {
    flex: 0,
    width: 350,
    height: 250,
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: "white",
  },  
  image: {
    width: 250,
    height: 220,
    alignSelf: 'center'
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginVertical: 15,
  },
  text: {
    fontSize: 20,
    width: 300,
    marginTop: 15,
    textAlign: 'center'
  }
});

export default AboutScreen;
