import { collection, getDocs } from "firebase/firestore";
import { Box, HStack, Image, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Alert as RNAlert } from "react-native";
import { auth, db } from "../../../services/FirebaseConfig";

export default function MeusPets() {
  const [pets, setPets] = useState([]);

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

  // Cria uma lista de 3 slots (widget)
  const widgets = [0, 1, 2].map((index) => pets[index] || null);

  return (
    <Box flex={1} alignItems="center" bg="#1BC5B7" p={4}>
      <Text fontSize="2xl" bold color="white" mb={10} mt={20} >
        🐾 Meus Pets
      </Text>

      <HStack space={4} mt={20} justifyContent="center">
        {widgets.map((pet, index) => (
          <VStack
            key={index}
            w={100}
            h={100}
            bg={pet ? "white" : index === 0 ? "gray.300" : "gray.200"}
            borderRadius={7}
            alignItems="center"
            justifyContent="center"
            opacity={pet ? 1 : 0.5} // desativado visualmente se não houver pet
          >
            {pet ? (
              <>
                <Image
                  source={{ uri: pet.fotos ? pet.fotos[0] : "https://via.placeholder.com/100" }}
                  alt={pet.nome}
                  w={"100%"}
                  h={"100%"}
                  borderRadius={5}
                  resizeMode="cover"
                />
                <Text mt={2} bold color="black">
                  {pet.nome}
                </Text>
              </>
            ) : (
              <Text bold color="gray.600">
                {index === 0 ? "Disponível" : "Vazio"}
              </Text>
            )}
          </VStack>
        ))}
      </HStack>
    </Box>
  );
}
