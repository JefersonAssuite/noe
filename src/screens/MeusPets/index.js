import { collection, getDocs } from "firebase/firestore";
import { Box, HStack, Image, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Dimensions, Alert as RNAlert } from "react-native";
import { auth, db } from "../../../services/FirebaseConfig";
import { BackHeader } from "../../components/BackHeader";

export default function MeusPets() {
  const [pets, setPets] = useState([]);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchPets = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const petsRef = collection(db, "usuarios", user.uid, "pets");
      const snapshot = await getDocs(petsRef);

      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPets(lista);

      if (lista.length === 0) {
        RNAlert.alert("Nenhum pet cadastrado");
      }
    };

    fetchPets();
  }, []);

  const widgets = [0, 1, 2].map((index) => pets[index] || null);
  const widgetSize = screenWidth / 4; // cada widget ocupa 1/4 da largura da tela, deixando espaço entre eles

  return (
    <Box flex={1}  justifyContent="flex-start" bg="#1BC5B7" p={4}>
       <BackHeader/>
      <Text fontSize="2xl" bold color="white" mt={20} mb={10} textAlign="center">
        🐾 Meus Pets
      </Text>

      <HStack space={4} justifyContent="center">
        {widgets.map((pet, index) => (
          <VStack key={index} alignItems="center">
            <Box
              w={widgetSize}
              h={widgetSize}
              bg={pet ? "white" : index === 0 ? "gray.300" : "gray.200"}
              borderRadius={7}
              overflow="hidden"
              opacity={pet ? 1 : 0.5}
            >
              {pet ? (
                <Image
                  source={{ uri: pet.fotos ? pet.fotos[0] : "https://via.placeholder.com/100" }}
                  alt={pet.nome}
                  w="100%"
                  h="100%"
                  resizeMode="cover"
                />
              ) : (
                <Box flex={1} justifyContent="center" alignItems="center">
                  <Text bold color="gray.600">
                    {index === 0 ? "Disponível" : "Vazio"}
                  </Text>
                </Box>
              )}
            </Box>

            {/* Nome do pet abaixo do widget */}
            <Text mt={2} bold color="white" textAlign="center">
              {pet ? pet.nome : ""}
            </Text>
          </VStack>
        ))}
      </HStack>
    </Box>
  );
}
