// src/components/BackHeader.js
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Box } from "native-base";
import { TouchableOpacity } from "react-native";

export  function BackHeader() {
  return (
    <Box p={4} mb={6} mt={10} alignItems="flex-start">
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
    </Box>
  );
}
