import { addDoc, collection, getFirestore } from "firebase/firestore";
import { Box, Button, Input, Text, TextArea, VStack } from "native-base";
import { useState } from "react";
import { app } from "../../../services/FirebaseConfig";
import { BackHeader } from '../../components/BackHeader';

export default function FaleConosco() {
  const db = getFirestore(app);

  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleEnviar = async () => {
    if (!email || !assunto || !mensagem) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "mensagens"), {
        email,
        assunto,
        mensagem,
        criadoEm: new Date(),
      });

      alert("Mensagem enviada com sucesso!");
      setEmail("");
      setAssunto("");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar: " + error.message);
    }
  };

  return (
    <Box flex={1} bg="#78C5BE" p={4}>
      <BackHeader/>
      <Text
        fontSize="2xl"
        bold
        color="white"
        textAlign="center"
        mb={6}
      >
        📩 Fale Conosco
      </Text>

      <Box bg="white" p={5} rounded="2xl" shadow={3}>
        <VStack space={4}>
          <Input
            placeholder="Seu email"
            value={email}
            onChangeText={setEmail}
            bg="#F1F1F1"
            borderRadius={10}
          />
          <Input
            placeholder="Assunto"
            value={assunto}
            onChangeText={setAssunto}
            bg="#F1F1F1"
            borderRadius={10}
          />
          <TextArea
            placeholder="Digite sua mensagem"
            value={mensagem}
            onChangeText={setMensagem}
            h={32}
            bg="#F1F1F1"
            borderRadius={10}
          />

          <Button
            onPress={handleEnviar}
            bg="#1BC5B7"
            _pressed={{ bg: "#159a90" }}
            rounded="xl"
          >
            Enviar
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
