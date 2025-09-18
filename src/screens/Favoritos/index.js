import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { Box, FlatList, Text } from "native-base";
import { useEffect, useState } from "react";
import { auth, db } from "../../../services/FirebaseConfig";
import { BackHeader } from "../../components/BackHeader";

export default function Favoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const favRef = collection(db, "usuarios", user.uid, "favoritos");
      const snapshot = await getDocs(favRef);

      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavoritos(lista);
    };

    fetchFavoritos();
  }, []);

  return (
    <Box flex={1} bg="#78C5BE">
      <BackHeader/>

      {/* Quadrado branco */}
      <Box
        flex={1}
        bg="white"
        borderTopLeftRadius={9}
        borderTopRightRadius={9}
        p={4}
      >
        <Text fontSize="xl" bold mb={4}>
           Cuidadores Favoritos
        </Text>

        {favoritos.length > 0 ? (
          <FlatList
            data={favoritos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Box
                p={3}
                mb={2}
                bg="gray.100"
                rounded="md"
                shadow={1}
              >
                <Text bold>{item.nome}</Text>
                <Text numberOfLines={2}>{item.observacao}</Text>
              </Box>
            )}
          />
        ) : (
          <Text color="gray.500" mt={4} textAlign="center">
            Ainda não existem cuidadores favoritos.
          </Text>
        )}
      </Box>
    </Box>
  );
}
