import { useRouter } from "expo-router";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { Box, FlatList, Image, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { db } from "../../../services/FirebaseConfig";
import { BackHeader } from "../../components/BackHeader";

export default function Hoteis() {
  const [hoteis, setHoteis] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHoteis = async () => {
      try {
        // Busca apenas quem é estabelecimento e do tipo "Hotel"
        const q = query(
          collectionGroup(db, "dadosCuidador"),
          where("estabelecimento", "==", "Sim"),
          where("tipo", "==", "Hotel") // se vc tiver um campo "tipo"
        );

        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHoteis(lista);
      } catch (error) {
        console.error("Erro ao buscar hotéis:", error);
      }
    };

    fetchHoteis();
  }, []);

  return (
    <Box flex={1} bg="#78C5BE" p={4}>
      <BackHeader/>
      <Text fontSize="2xl" bold color="white" mb={6} textAlign="center">
        🏨 Hotéis
      </Text>

      <FlatList
        data={hoteis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/hoteis/${item.id}`)}>
            <Box
              bg="white"
              rounded="xl"
              p={3}
              mb={4}
              shadow={3}
              flexDirection="row"
              alignItems="center"
            >
              {/* Foto */}
              <Image
                source={{
                  uri: item.fotosLocal?.[0] || "https://via.placeholder.com/100",
                }}
                alt={item.ondeRecebe}
                w={100}
                h={100}
                borderRadius={10}
                resizeMode="cover"
              />

              {/* Texto */}
              <VStack flex={1} ml={3} space={1}>
                <Text fontSize="md" bold color="black">
                  {item.ondeRecebe || "Hotel sem nome"}
                </Text>
                <Text fontSize="sm" color="gray.600" numberOfLines={2}>
                  {item.cnpj || "CNPJ não informado"}
                </Text>
              </VStack>
            </Box>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text textAlign="center" color="white" mt={10}>
            Nenhum hotel encontrado
          </Text>
        }
      />
    </Box>
  );
}
