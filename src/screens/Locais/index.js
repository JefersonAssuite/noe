// app/(tabs)/locais.js
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Box, HStack, Image, Skeleton, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { app } from "../../../services/FirebaseConfig";

const Locais = () => {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        const auth = getAuth(app);
        const db = getFirestore(app);
        const user = auth.currentUser;

        if (!user) return;

        const querySnapshot = await getDocs(
          collection(db, "usuarios", user.uid, "dadosCuidador")
        );

        const locaisData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocais(locaisData);
      } catch (error) {
        console.error("Erro ao buscar locais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocais();
  }, []);

  return (
    <Box flex={1} bg="#F9F9F9" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Meus Locais
      </Text>

      {loading ? (
        <VStack space={4}>
          <Skeleton h={120} rounded="lg" />
          <Skeleton h={120} rounded="lg" />
        </VStack>
      ) : (
        <ScrollView>
          {locais.map((item) => (
            <Box
              key={item.id}
              bg="white"
              p={4}
              rounded="lg"
              shadow={2}
              mb={4}
            >
              {/* Fotos do Local */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space={2}>
                  {item.fotosLocal?.map((foto, index) => (
                    <Image
                      key={index}
                      source={{ uri: foto }}
                      alt="Foto Local"
                      size="xl"
                      rounded="lg"
                    />
                  ))}
                </HStack>
              </ScrollView>

              {/* Informações */}
              <VStack mt={3} space={1}>
                <Text fontSize="lg" bold>
                  {item.ondeRecebe || "Local não informado"}
                </Text>
                <Text color="gray.600">
                  {item.rua}, {item.numero} - {item.cidade}/{item.estado}
                </Text>
                <Text>
                  Área aberta:{" "}
                  {item.areaAberta === "Sim" ? "✅ Sim" : "❌ Não"}
                </Text>
                <Text>
                  Climatizado:{" "}
                  {item.climatizado === "Sim" ? "✅ Sim" : "❌ Não"}
                </Text>
                {item.observacao && (
                  <Text italic color="gray.500">
                    "{item.observacao}"
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </ScrollView>
      )}
    </Box>
  );
};

export default Locais;
