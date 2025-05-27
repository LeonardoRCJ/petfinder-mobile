import React, { useRef, useState } from 'react';
import { Poppins_900Black } from '@expo-google-fonts/poppins/900Black';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { useFonts } from '@expo-google-fonts/poppins';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import {
  View,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  Button,
  Alert,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/imageHome1.png'),
    title: 'Nosso Aplicativo',
    text: 'Conectando corações a lares: encontre, adote e transforme vidas com um só toque',
  },
  {
    id: '2',
    image: require('../../assets/imageHome2.png'),
    title: 'ADOTE',
    text: 'Dê uma nova chance a quem só precisa de amor. Adotar é mudar duas vidas: a deles e a sua',
  },
  {
    id: '3',
    image: require('../../assets/imageHome3.png'),
    title: 'Não Pode Ficar? ',
    text: 'Tudo bem não poder continuar. O importante é dar amor até o fim  e um novo começo para quem só quer continuar sendo amado',
  },
  {
    id: '4',
    image: require('../../assets/imageHome4.png'),
    title: 'Junte-se a Nós',
    text: 'Conecte-se com quem ama os animais tanto quanto você. Encontre, adote ou ajude a encontrar um lar cheio de carinho!',
    button: 'CRIE SUA CONTA',
  },
];

export const PageIndicator = ({ total, currentIndex }) => {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_900Black,
  });

  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

export default function Home() {
  const navigation = useNavigation();
  const [pageIndex, setPageIndex] = useState(0);
  const flatListRef = useRef(null);

  const onScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setPageIndex(newIndex);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={slides}
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image style={styles.image} source={item.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
            {pageIndex === slides.length - 1 && (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.buttonText}>Criar Conta</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <View style={styles.indicatorContainer}>
        <PageIndicator total={slides.length} currentIndex={pageIndex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#75C0F8',
    display: 'flex',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingBottom: 40,
    backgroundColor: '#75C0F8',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  inactiveDot: {
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  image: {
    display: 'flex',
    marginTop: 30,
    width: 300,
    height: 300,
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Poppins_900Black',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
    marginTop: 20,
    paddingRight: 50,
    paddingLeft: 50,
    fontFamily: 'Poppins_700Bold',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FF6909',
    borderRadius: 20,
    marginTop: 10,
    width: 150,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
