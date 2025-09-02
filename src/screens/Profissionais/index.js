import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { Box, FlatList, Text } from "native-base";
import { useEffect, useState } from "react";
import { db } from "../../../services/FirebaseConfig";

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        // Busca todos documentos em qualquer subcoleção "dadosCuidador"
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
    <Box flex={1} bg="#1BC5B7" p={4}>
      <Text fontSize="2xl" bold color="white" mb={6}>
        🛁 Profissionais de Banho & Tosa
      </Text>

      <FlatList
        data={profissionais}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Box
            bg="white"
            rounded="lg"
            p={4}
            mb={4}
            shadow={2}
            minH={100}
          >
            <Text fontSize="lg" bold color="black">
              {item.nome || "Sem nome"}
            </Text>
            <Text
              fontSize="sm"
              color="gray.600"
              numberOfLines={2}
              ellipsizeMode="tail"
              mt={2}
            >
              {item.observacao || "Sem observações."}
            </Text>
          </Box>
        )}
        ListEmptyComponent={
          <Text textAlign="center" color="white" mt={10}>
            Nenhum profissional encontrado
          </Text>
        }
      />
    </Box>
  );
}
