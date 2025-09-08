import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { Box, FlatList, Image, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { auth, db } from "../../../services/FirebaseConfig";

export default function Locais() {
  const [locais, setLocais] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLocais = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const locaisRef = collection(db, "usuarios", user.uid, "dadosCuidador");
      const snapshot = await getDocs(locaisRef);

      // Pega apenas locais que são estabelecimentos
      const lista = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.estabelecimento === "Sim");

      setLocais(lista);
    };

    fetchLocais();
  }, []);

  // Sempre 3 slots
  const widgets = [0, 1, 2].map((i) => locais[i] || null);

  return (
    <Box flex={1} bg="#78C5BE" p={4} alignItems="center">
      <Text fontSize="2xl" bold color="white" mt={10} mb={6}>
        🏠 Locais
      </Text>

      <FlatList
        data={widgets}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2} // 2 por linha
        columnWrapperStyle={{ justifyContent: "center", gap: 16 }}
        contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
        renderItem={({ item: local, index }) => (
          <VStack
            w={140}
            h={140}
            bg={local ? "white" : index === 0 ? "gray.300" : "gray.200"}
            borderRadius={10}
            alignItems="center"
            justifyContent="center"
            opacity={local ? 1 : 0.5}
            p={2}
          >
            {local ? (
              <>
                <Image
                  source={{
                    uri: local.fotosLocal?.[0] || "https://via.placeholder.com/140",
                  }}
                  alt={local.ondeRecebe}
                  w="100%"
                  h="70%"
                  borderRadius={8}
                  resizeMode="cover"
                />
                <Text mt={2} bold color="black" numberOfLines={1}>
                  {local.ondeRecebe}
                </Text>
                <Text fontSize="xs" color="gray.600" numberOfLines={1}>
                  {local.cnpj || "Sem CNPJ"}
                </Text>
              </>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  index === 0 ? router.push("/auth/formcuidador") : null
                }
                style={{ alignItems: "center" }}
              >
                <Text bold color="gray.600" textAlign="center">
                  {index === 0 ? "Adicionar Local +" : "Vazio"}
                </Text>
              </TouchableOpacity>
            )}
          </VStack>
        )}
      />
    </Box>
  );
}
