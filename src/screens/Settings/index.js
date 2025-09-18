import { Box, HStack, Switch, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  return (
    <Box flex={1} bg="#78C5BE">
      {/* Espaço no topo */}
      <Box height={30} />

      {/* Container principal */}
      <Box
        flex={1}
        bg="#F9F9F9"
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        p={4}
      >
        {/* Título */}
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
          Configurações
        </Text>

        <VStack space={4}>
          {/* Opção 1 */}
          <HStack
            alignItems="center"
            justifyContent="space-between"
            bg="#F1F1F1"
            p={3}
            borderRadius={10}
            // sombra
            style={{
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text fontSize="md">Notificações</Text>
            <Switch colorScheme="emerald" />
          </HStack>

          {/* Opção 2 */}
          <TouchableOpacity>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              bg="#F1F1F1"
              p={3}
              borderRadius={10}
              style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text fontSize="md">Editar Perfil</Text>
              <Text color="#78C5BE">➝</Text>
            </HStack>
          </TouchableOpacity>

          {/* Opção 3 */}
          <TouchableOpacity>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              bg="#F1F1F1"
              p={3}
              borderRadius={10}
              style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text fontSize="md">Privacidade</Text>
              <Text color="#78C5BE">➝</Text>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </Box>
    </Box>
  );
}
