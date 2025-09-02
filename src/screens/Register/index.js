// src/screens/Register.js
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Box, ScrollView, Text, VStack } from "native-base";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, TouchableOpacity, View } from "react-native";
import { app } from "../../../services/FirebaseConfig";

const estadosBrasileiros = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [image, setImage] = useState(null);


  const onSubmit = async (data) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    try {
      // 1. Criar usuário com e-mail e senha
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.senha
      );
      const uid = userCredential.user.uid;

      // 2. Upload da imagem (se tiver)
      let fotoUrl = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `usuarios/${uid}/perfil.jpg`);
        await uploadBytes(storageRef, blob);
        fotoUrl = await getDownloadURL(storageRef);
      }

      // 3. Salvar dados no Firestore
      await setDoc(doc(db, "usuarios", uid), {
        nome: data.nome,
        nascimento: data.nascimento,
        email: data.email,
        cpf: data.cpf,
        telefone: data.telefone,
        cep: data.cep,
        numero: data.numero,
        endereco: data.endereco,
        estado: data.estado,
        cidade: data.cidade,
        fotoUrl: fotoUrl,
        criadoEm: new Date(),
      });

      router.push("/auth/registerrole");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar: " + error.message);
    }
  };

  return (
    <Box flex={1} bg="#78C5BE">
      <ScrollView>
        {/* Espaço superior */}
        <Box height={150} />

        {/* Container do formulário */}
        <Box
          flex={1}
          bg="#F9F9F9"
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          p={4}
        >
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
            Cadastre-se
          </Text>

          <VStack space={4}>
            {/* Nome */}
            <Text fontSize="lg">Nome</Text>
            <Controller
              control={control}
              name="nome"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Seu nome"
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />
            {errors.nome && <Text color="red.500">{errors.nome.message}</Text>}

            {/* Data de Nascimento */}
            <Text fontSize="lg">Data de Nascimento</Text>
            <Controller
              control={control}
              name="nascimento"
              rules={{ required: "Informe sua data de nascimento" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="DD/MM/AAAA"
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />

            {/* Email */}
            <Text fontSize="lg">Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />

            {/* Senha */}
            <Text fontSize="lg">Senha</Text>
            <Controller
              control={control}
              name="senha"
              rules={{
                required: "Senha obrigatória",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message: "Mínimo 6 caracteres com letras e números",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />
            {errors.senha && <Text color="red.500">{errors.senha.message}</Text>}

            {/* Confirmação de Senha */}
            <Text fontSize="lg">Confirme a Senha</Text>
            <Controller
              control={control}
              name="confirmarSenha"
              rules={{
                validate: (value) =>
                  value === watch("senha") || "As senhas não coincidem",
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Confirme sua senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />
            {errors.confirmarSenha && (
              <Text color="red.500">{errors.confirmarSenha.message}</Text>
            )}

            {/* CPF */}
            <Text fontSize="lg">CPF</Text>
            <Controller
              control={control}
              name="cpf"
              rules={{ required: "CPF obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />

            {/* Telefone */}
            <Text fontSize="lg">Telefone</Text>
            <Controller
              control={control}
              name="telefone"
              rules={{ required: "Telefone obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />

            {/* CEP + Número */}
            <Text fontSize="lg">CEP</Text>
            <Box flexDirection="row" alignItems="center">
              <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="00000-000"
                    keyboardType="numeric"
                    onChangeText={onChange}
                    value={value}
                    style={{
                      padding: 10,
                      marginTop: -6,
                      borderRadius: 10,
                      backgroundColor: "#F1F1F1",
                      shadowOpacity: 0.1,
                      width: 200,
                    }}
                  />
                )}
              />
              <Text fontSize="lg" pl={5}>
                Nº
              </Text>
              <Controller
                control={control}
                name="numero"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nº"
                    keyboardType="numeric"
                    onChangeText={onChange}
                    value={value}
                    style={{
                      padding: 10,
                      width: 100,
                      marginLeft: 10,
                      marginTop: -6,
                      borderRadius: 10,
                      backgroundColor: "#F1F1F1",
                      shadowOpacity: 0.1,
                    }}
                  />
                )}
              />
            </Box>

            {/* Endereço */}
            <Text fontSize="lg">Endereço</Text>
            <Controller
              control={control}
              name="endereco"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Rua:"
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />

            {/* Estado */}
            <Text fontSize="lg">Estado</Text>
            <Controller
              control={control}
              name="estado"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={{
                      marginTop: -6,
                      borderRadius: 10,
                      backgroundColor: "#F1F1F1",
                    }}
                  >
                    <Picker.Item label="Selecione o estado" value="" />
                    {estadosBrasileiros.map((uf) => (
                      <Picker.Item key={uf} label={uf} value={uf} />
                    ))}
                  </Picker>
                </View>
              )}
            />

            {/* Cidade */}
            <Text fontSize="lg">Cidade</Text>
            <Controller
              control={control}
              name="cidade"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Cidade"
                  onChangeText={onChange}
                  value={value}
                  style={{
                    padding: 10,
                    marginTop: -6,
                    borderRadius: 10,
                    backgroundColor: "#F1F1F1",
                    shadowOpacity: 0.1,
                  }}
                />
              )}
            />

            {/* Botão */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: "#1BC5B7",
                marginTop: 20,
                marginBottom: 20,
                borderRadius: 10,
              }}
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                paddingTop={10}
                paddingBottom={10}
                color="#ffffff"
              >
                Próximo
              </Text>
            </TouchableOpacity>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
