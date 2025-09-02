import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { app } from "../../../services/FirebaseConfig";

export default function RegisterRole() {
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleSaveRole = async () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const uid = auth.currentUser?.uid;

    if (!uid || !role) return alert("Selecione um perfil.");

    try {
      await updateDoc(doc(db, "usuarios", uid), {
        perfil: role,
      });
       if (role === "tutor") {
          router.replace("auth/cadastrotutor");
        } else if (role === "cuidador") {
          router.replace("/auth/cadastrocuidador");
        }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil.");
    }
  };

  return (
    <View style={{ padding: 20, justifyContent:"center", flex:1, backgroundColor:"#1BC5B7" }}>
      <Text style={{ fontSize: 20, marginBottom: 20, color:"#FFFFFF", justifyContent:"center" }}>Escolha seu perfil:</Text>

      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
       style={{ marginTop:-2, borderRadius:10,backgroundColor:"#F1F1F1",shadowOpacity:0.1}}
      >
        <Picker.Item label="Selecione" value="" />
        <Picker.Item label="Tutor" value="tutor" />
        <Picker.Item label="Cuidador" value="cuidador" />
      </Picker>

      <TouchableOpacity
        onPress={handleSaveRole}
        style={{
          backgroundColor: "#78C5BE",
          marginTop:10,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>AVANÇAR</Text>
      </TouchableOpacity>
    </View>
  );
}
