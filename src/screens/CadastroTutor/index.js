import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Box, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../../../services/FirebaseConfig';


const CadastroTutor = () => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      fotos: [],
    },
  });

   const pickImage = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      const fotosAtuais = watch("fotos") || [];
      const novasFotos = [...fotosAtuais];
      novasFotos[index] = selectedImage;
      setValue("fotos", novasFotos);
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
      let fotosUrls = [];

      for (let i = 0; i < data.fotos.length; i++) {
        const fotoUri = data.fotos[i];
        const response = await fetch(fotoUri);
        const blob = await response.blob();

        const storageRef = ref(storage, `usuarios/${user.uid}/pets/foto${i + 1}.jpg`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        fotosUrls.push(downloadUrl);
      }

      await addDoc(collection(db, "usuarios", user.uid, "pets"), {
        nome: data.nome,
        animal: data.animal,
        nascimento: data.nascimento || null,
        raca: data.raca,
        sexo: data.sexo,
        porte: data.porte,
        possuiCondicao: data.possuiCondicao,
        tipoCondicao: data.tipoCondicao || null,
        especificacao: data.especificacao || null,
        castrado: data.castrado,
        fotos: fotosUrls,
        criadoEm: new Date(),
      });

      alert("Pet cadastrado com sucesso!");
      router.replace("(tabs)")
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      alert("Erro ao salvar pet: " + error.message);
    }
  };
  return(
    <Box flex={1} bg="#78C5BE">
      <ScrollView>
        <Box height={100} />
        <Box bg="#F9F9F9" borderTopLeftRadius={30} borderTopRightRadius={30} p={4}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
            Cadastre seu Amigão
          </Text>

          <VStack space={4}>
            <Text>Nome</Text>
            <Controller
              control={control}
              name="nome"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="Nome do pet" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
              )}
            />

            <Text>Qual o animal?</Text>
            <Controller
              control={control}
              name="animal"
              render={({ field: { onChange, value } }) => (
                <Picker selectedValue={value} onValueChange={onChange}
                  style={{ backgroundColor: '#F1F1F1', borderRadius: 10 }}>
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Cachorro" value="cachorro" />
                  <Picker.Item label="Gato" value="gato" />
                  <Picker.Item label="Pássaro" value="passaro" />
                  <Picker.Item label="Outro" value="outro" />
                </Picker>
              )}
            />

            <Text>Data de Nascimento (opcional)</Text>
            <Controller
              control={control}
              name="nascimento"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="DD/MM/AAAA" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
              )}
            />

            <Text>Raça</Text>
            <Controller
              control={control}
              name="raca"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="Raça" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
              )}
            />

            <Text>Sexo</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Macho', 'Fêmea'].map((sexo) => (
                <TouchableOpacity key={sexo} onPress={() => setValue('sexo', sexo)}
                  style={{ marginRight: 20 }}>
                  <Text>{watch('sexo') === sexo ? '🔘' : '⚪'} {sexo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text>Porte</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Pequeno', 'Médio', 'Grande'].map((porte) => (
                <TouchableOpacity key={porte} onPress={() => setValue('porte', porte)}
                  style={{ marginRight: 20 }}>
                  <Text>{watch('porte') === porte ? '🔘' : '⚪'} {porte}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text>Possui alguma condição (patologia ou deficiência)?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Sim', 'Não'].map((condicao) => (
                <TouchableOpacity key={condicao} onPress={() => setValue('possuiCondicao', condicao)}
                  style={{ marginRight: 20 }}>
                  <Text>{watch('possuiCondicao') === condicao ? '🔘' : '⚪'} {condicao}</Text>
                </TouchableOpacity>
              ))}
            </View>

           
                <Text>Qual?</Text>
                <Controller
                  control={control}
                  name="tipoCondicao"
                  render={({ field: { onChange, value } }) => (
                    <Picker selectedValue={value} onValueChange={onChange}
                      style={{ backgroundColor: '#F1F1F1', borderRadius: 10 }}>
                      <Picker.Item label="Selecione" value="" />
                      <Picker.Item label="Olhos" value="olhos" />
                      <Picker.Item label="Patas" value="patas" />
                      <Picker.Item label="Pele" value="pele" />
                      <Picker.Item label="Outros" value="outros" />
                    </Picker>
                  )}
                />

                <Text>Especifique</Text>
                <Controller
                  control={control}
                  name="especificacao"
                  render={({ field: { onChange, value } }) => (
                    <TextInput placeholder="Ex: cegueira" onChangeText={onChange} value={value}
                      style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
                  )}
                />
              

            <Text>Castrado?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['sim', 'nao'].map((castrado) => (
                <TouchableOpacity key={castrado} onPress={() => setValue('castrado', castrado)}
                  style={{ marginRight: 20 }}>
                  <Text>{watch('castrado') === castrado ? '🔘' : '⚪'} {castrado}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text>Fotos (máximo 3)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[0, 1, 2].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => pickImage(index)}
                  style={{ width: 90, height: 90, backgroundColor: '#ddd', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                >
                  {(watch("fotos")?.[index]) ? (
  <Image source={{ uri: watch("fotos")[index] }} style={{ width: 90, height: 90, borderRadius: 10 }} />
                   ) : (
                    <Text>+</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{ backgroundColor: '#1BC5B7', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Próximo</Text>
            </TouchableOpacity>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
};
export default CadastroTutor;



