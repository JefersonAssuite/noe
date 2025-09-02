import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Box, TextArea, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../../../services/FirebaseConfig';

const CadastroPerfil = () => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      fotosPerfil: [],
    },
  });

  // Função para escolher imagem
  const pickImage = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      const fotosAtuais = watch("fotosPerfil") || [];
      const novasFotos = [...fotosAtuais];
      novasFotos[index] = selectedImage;
      setValue("fotosPerfil", novasFotos);
    }
  };

  const onSubmit = async (data) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const user = auth.currentUser;
    const router = useRouter();

    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      // Upload das fotos
      let fotosUrls = [];
      for (let i = 0; i < data.fotosPerfil.length; i++) {
        if (data.fotosPerfil[i]) {
          const response = await fetch(data.fotosPerfil[i]);
          const blob = await response.blob();
          const storageRef = ref(storage, `usuarios/${user.uid}/perfil/foto${i + 1}.jpg`);
          await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);
          fotosUrls.push(url);
        }
      }

      await addDoc(collection(db, "usuarios", user.uid, "perfil"), {
        formacaoVeterinaria: data.formacaoVeterinaria,
        gostaAnimais: data.gostaAnimais,
         profissional: dados.profissional,
        tempoLivre: data.tempoLivre,
        profissao: data.profissao,
        informacaoImportante: data.informacaoImportante,
        fotosPerfil: fotosUrls,
        criadoEm: new Date(),
      });

      alert("Perfil salvo com sucesso!");
      router.replace("/(tabs)")

    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar: " + error.message);
    }
  };

  return (
    <Box flex={1} bg="#78C5BE">
      <ScrollView>
        <Box height={100} />

        <Box bg="#F9F9F9" borderTopLeftRadius={30} borderTopRightRadius={30} p={4}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
            Vamos entender sobre a sua relação com animais
          </Text>

          <VStack space={4}>
            {/* Formação Veterinária */}
            <Text>Possui formação em medicina veterinária?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Sim', 'Não'].map((opcao) => (
                <TouchableOpacity key={opcao} onPress={() => setValue('formacaoVeterinaria', opcao)}
                  style={{ marginRight: 20,marginBottom:10 }}>
                  <Text>{watch('formacaoVeterinaria') === opcao ? '🔘' : '⚪'} {opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* O que faz você gostar de animais */}
            <Text>O que faz você gostar de animais?</Text>
            <Controller
              control={control}
              name="gostaAnimais"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="Digite aqui" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10,marginBottom:10 }} />
              )}
            />

            {/* Tempo livre */}
            <Text>Possui tempo livre para receber os animais?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Sim', 'Não'].map((opcao) => (
                <TouchableOpacity key={opcao} onPress={() => setValue('tempoLivre', opcao)}
                  style={{ marginRight: 20,marginBottom:10 }}>
                  <Text>{watch('tempoLivre') === opcao ? '🔘' : '⚪'} {opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Profissão */}
            <Text>Profissão</Text>
            <Controller
              control={control}
              name="profissao"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="Ex: Engenheiro" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 ,marginBottom:10}} />
              )}
            />

            {/* Observação */}
            <Text>Escreva alguma informação que achar importante</Text>
            <Controller
              control={control}
              name="informacaoImportante"
              render={({ field: { onChange, value } }) => (
                <TextArea placeholder="Digite aqui" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', borderRadius: 10 }} />
              )}
            />

            {/* Fotos do perfil */}
            <Text>Fotos do perfil (2)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[0, 1].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => pickImage(index)}
                  style={{ width: 90, height: 90, backgroundColor: '#ddd', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                >
                  {(watch("fotosPerfil")?.[index]) ? (
                    <Image source={{ uri: watch("fotosPerfil")[index] }} style={{ width: 90, height: 90, borderRadius: 10 }} />
                  ) : (
                    <Text>+</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão Avançar */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{ backgroundColor: '#1BC5B7', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center',marginBottom:50 }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Avançar</Text>
            </TouchableOpacity>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default CadastroPerfil;
