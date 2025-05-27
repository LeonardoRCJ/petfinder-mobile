import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native-reanimated/lib/typescript/Animated";

const ViewAllPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
        setLoading(true);
      try {
        const response = await fetch(
          "https://petfinder-l00r.onrender.com/pets"
        );
        const data = response.data;
        setPets(data)
      } catch (err) {
        console.error('Erro ao carregar pets ', err);
      }finally {
        setLoading(false)
      }
    };

    getData();
  }, []);

  return(
    <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={(item) => {
            <View>
                <Text>
                    {item.petName}
                </Text>
            </View>
        }}
    />
  );
};

export default ViewAllPets;
