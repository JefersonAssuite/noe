import { db } from "@/services/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Box, HStack, Image, Pressable, ScrollView, Skeleton, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [cuidadores, setCuidadores] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const actions = [
    { label: "Meus Pets", icon: "paw", route: "/meus-pets" },
    { label: "Profissionais", icon: "briefcase", route: "/profissionais" },
    { label: "Locais", icon: "location", route: "/locais" },
    { label: "PetShop", icon: "storefront", route: "/estabelecimentos" },
    { label: "Favoritos", icon: "heart", route: "/favoritos" },
     { label: "Fale Conosco", icon: "chatbubbles", route: "/fale-conosco" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setUserData(docSnap.data());
        }

        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const list = [];

        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();

          // Buscar subcoleção perfil (se existir)
          let gostaAnimais = null;
          const perfilSnapshot = await getDocs(collection(db, "usuarios", userDoc.id, "perfil"));
          perfilSnapshot.forEach((perfilDoc) => {
            const perfilData = perfilDoc.data();
            if (perfilData.gostaAnimais !== undefined) gostaAnimais = perfilData.gostaAnimais;
          });

          list.push({ id: userDoc.id, ...userData, gostaAnimais });
        }

        setCuidadores(list);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box flex={1} bg="#fff">
      {/* Header */}
      <Box bg="#1BC5B7" px={4} py={6}>
        <HStack alignItems="center" space={4} marginTop={12}>
          {loading ? (
            <>
              <Skeleton size="12" rounded="full" />
              <VStack space={2}>
                <Skeleton h="4" w="32" rounded="md" />
                <Skeleton h="3" w="24" rounded="md" />
              </VStack>
            </>
          ) : (
            <>
              <Image
                source={{ uri: userData?.foto || "https://via.placeholder.com/50" }}
                alt="Foto de Perfil"
                size="md"
                borderRadius="full"
              />
              <VStack>
                <Text color="white" fontSize="lg" fontWeight="bold">
                  Olá, {userData?.nome || "Usuário"}
                </Text>
                <Text color="white" fontSize="sm">
                  {userData?.cidade} - {userData?.uf}
                </Text>
              </VStack>
            </>
          )}
        </HStack>
      </Box>

      <ScrollView>
        {/* Scroll Horizontal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} px={4} mt={4}>
          <HStack space={4}>
            {actions.map((item, index) => (
              <Pressable
                key={index}
                bg="#1BC5B7"
                w={92}
                h={92}
                borderRadius="full"
                justifyContent="center"
                alignItems="center"
                onPress={() => router.push(item.route)}
              >
                <Ionicons name={item.icon} size={24} color="#fff" />
                <Text color="white" fontSize="xs" mt={1} textAlign="center">
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>

        {/* Título */}
        <Text fontSize="lg" fontWeight="bold" mt={4} mb={2} px={4}>
          Cuidadores nessa região
        </Text>

        {/* Lista de cuidadores usando map */}
        <VStack px={4} space={3} mb={6}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <HStack
                  key={i}
                  bg="#F9F9F9"
                  p={4}
                  borderRadius="lg"
                  space={3}
                  alignItems="center"
                  shadow={1}
                >
                  <Skeleton size="16" rounded="full" />
                  <VStack space={2} flex={1}>
                    <Skeleton h="4" w="32" />
                    <Skeleton h="3" w="24" />
                  </VStack>
                </HStack>
              ))
            : cuidadores.map((item) => (
                <HStack
                  key={item.id}
                  bg="#F9F9F9"
                  p={3}
                  borderRadius="lg"
                  space={3}
                  alignItems="center"
                  shadow={1}
                >
                  <Image
                    source={{ uri: item.foto || "https://via.placeholder.com/80" }}
                    alt="Foto Cuidador"
                    size="lg"
                    borderRadius="full"
                  />
                  <VStack>
                    <Text fontSize="md" fontWeight="bold">
                      {item.nome}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {item.gostaAnimais ? "Ama animais ❤️" : "Info não disponível"}
                    </Text>
                  </VStack>
                </HStack>
              ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
