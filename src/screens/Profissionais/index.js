import { useRouter } from 'expo-router';
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { Box, FlatList, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { db } from "../../../services/FirebaseConfig";
import { BackHeader } from "../../components/BackHeader";

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const q = query(
          collectionGroup(db, "dadosCuidador"),
          where("profissional", "==", "sim")
        );

        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfissionais(lista);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      }
    };

    fetchProfissionais();
  }, []);

  return (
    <Box flex={1} bg="#1BC5B7">
     <BackHeader/>
      {/* Título */}
      <Box  px={4}>
        <Text fontSize="2xl" bold color="white">
          Profissionais
        </Text>
      </Box>

      {/* Conteúdo branco */}
      <Box
        flex={1}
        bg="white"
        mt={4} // espaço do topo
        borderTopLeftRadius={30}
        borderTopRightRadius={30}
        p={4}
      >
        <FlatList
          data={profissionais}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Box
              bg="#F9F9F9"
              rounded="lg"
              p={4}
              mb={4}
              shadow={2}
              minH={100}
            >
              <VStack space={2}>
                <Text fontSize="lg" bold color="black">
                  {item.nome || "Sem nome"}
                </Text>
                <Text fontSize="sm" color="gray.600" numberOfLines={2} ellipsizeMode="tail">
                  {item.observacao || "Sem observações."}
                </Text>
                {item.estabelecimento === "Sim" && (
                  <Text fontSize="sm" color="gray.800">
                    CNPJ: {item.cnpj || "Não informado"}
                  </Text>
                )}
              </VStack>
            </Box>
          )}
          ListEmptyComponent={
            <Text textAlign="center" mt={10} color="gray.500">
              Nenhum profissional encontrado
            </Text>
          }
        />
      </Box>
    </Box>
  );
}
