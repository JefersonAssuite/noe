import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Box, TextArea, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../../../services/FirebaseConfig';

const CadastroCuidador = () => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      fotosDocumentos: [],
      fotosLocal: [],
      telefone1: "",
      telefone2: "",
      instagram: "",
      cnpj:"",
      observacao:"",
    },
  });

  // Função para escolher imagens
  const pickImage = async (key, index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      const imagensAtuais = watch(key) || [];
      const novasImagens = [...imagensAtuais];
      novasImagens[index] = selectedImage;
      setValue(key, novasImagens);
    }
  };

  const onSubmit = async (data) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const user = auth.currentUser;
    const router =useRouter();

    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      // Upload das imagens
      let fotosDocsUrls = [];
      for (let i = 0; i < data.fotosDocumentos.length; i++) {
        if (data.fotosDocumentos[i]) {
          const response = await fetch(data.fotosDocumentos[i]);
          const blob = await response.blob();
          const storageRef = ref(storage, `usuarios/${user.uid}/documentos/doc${i + 1}.jpg`);
          await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);
          fotosDocsUrls.push(url);
        }
      }

      let fotosLocalUrls = [];
      for (let i = 0; i < data.fotosLocal.length; i++) {
        if (data.fotosLocal[i]) {
          const response = await fetch(data.fotosLocal[i]);
          const blob = await response.blob();
          const storageRef = ref(storage, `usuarios/${user.uid}/local/foto${i + 1}.jpg`);
          await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);
          fotosLocalUrls.push(url);
        }
      }

      await addDoc(collection(db, "usuarios", user.uid, "dadosCuidador"), {
  ...data,
   profissional: data.profissional,
  fotosDocumentos: fotosDocsUrls,
  fotosLocal: fotosLocalUrls,
  criadoEm: new Date(),
});

      alert("Dados salvos com sucesso!");
      router.replace("/auth/formcuidador")
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar: " + error.message);
    }
  };

  return (
    <Box flex={1} bg="#78C5BE">
      <ScrollView>
        <Box height={100} />
        <Box bg="#F9F9F9" borderTopLeftRadius={30} borderTopRightRadius={30} p={4}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
            Cadastro do Cuidador
          </Text>

          <VStack space={4}>
            <Text>Onde vai recebê-los</Text>
            <Controller
              control={control}
              name="ondeRecebe"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="Ex: Minha casa" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
              )}
            />

            {/* CEP e Rua */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, value } }) => (
                  <TextInput placeholder="CEP" keyboardType="numeric" onChangeText={onChange} value={value}
                    style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10, width: '48%' }} />
                )}
              />
              <Controller
                control={control}
                name="rua"
                render={({ field: { onChange, value } }) => (
                  <TextInput placeholder="Rua" onChangeText={onChange} value={value}
                    style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10, width: '48%' }} />
                )}
              />
            </View>

            {/* Nº e Cidade */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Controller
                control={control}
                name="numero"
                render={({ field: { onChange, value } }) => (
                  <TextInput placeholder="Nº" keyboardType="numeric" onChangeText={onChange} value={value}
                    style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10, width: '48%' }} />
                )}
              />
              <Controller
                control={control}
                name="cidade"
                render={({ field: { onChange, value } }) => (
                  <TextInput placeholder="Cidade" onChangeText={onChange} value={value}
                    style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10, width: '48%' }} />
                )}
              />
            </View>

            {/* Complemento e Estado */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Controller
                control={control}
                name="complemento"
                render={({ field: { onChange, value } }) => (
                  <TextInput placeholder="Complemento" onChangeText={onChange} value={value}
                    style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10, width: '48%' }} />
                )}
              />
              <Controller
                control={control}
                name="estado"
                render={({ field: { onChange, value } }) => (
                  <TextInput placeholder="Estado/UF" onChangeText={onChange} value={value}
                    style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10, width: '48%' }} />
                )}
              />
            </View>

            {/* Telefones e Instagram */}
            <Text>Telefone 1</Text>
            <Controller
              control={control}
              name="telefone1"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="(00) 00000-0000" keyboardType="phone-pad" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
              )}
            />
            <Text>Telefone 2</Text>
            <Controller
              control={control}
              name="telefone2"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="(00) 00000-0000" keyboardType="phone-pad" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
              )}
            />
            <Text>Instagram</Text>
            <Controller
              control={control}
              name="instagram"
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="@seuusuario" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
              )}
            />

            {/* É estabelecimento */}
            <Text>É um estabelecimento?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Sim', 'Não'].map((opcao) => (
                <TouchableOpacity key={opcao} onPress={() => setValue('estabelecimento', opcao)}
                  style={{ marginRight: 20 }}>
                  <Text>{watch('estabelecimento') === opcao ? '🔘' : '⚪'} {opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {watch('estabelecimento') === 'Sim' && (
              <>
                <Text>CNPJ</Text>
                <Controller
                  control={control}
                  name="cnpj"
                  render={({ field: { onChange, value } }) => (
                    <TextInput placeholder="00.000.000/0000-00" keyboardType="numeric" onChangeText={onChange} value={value}
                      style={{ backgroundColor: '#F1F1F1', padding: 10, borderRadius: 10 }} />
                  )}
                />
              </>
            )}

            {/* Quantidade de cômodos */}
            <Text>Quantidade de Cômodos</Text>
            <Controller
              control={control}
              name="qtdComodos"
              render={({ field: { onChange, value } }) => (
                <Picker selectedValue={value} onValueChange={onChange}
                  style={{ backgroundColor: '#F1F1F1', borderRadius: 10 }}>
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="Mais de 3" value="mais3" />
                </Picker>
              )}
            />

            {/* Área aberta e ambiente climatizado */}
            <Text>Possui área aberta?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Sim', 'Não'].map((opcao) => (
                <TouchableOpacity key={opcao} onPress={() => setValue('areaAberta', opcao)}
                  style={{ marginRight: 20 }}>
                  <Text>{watch('areaAberta') === opcao ? '🔘' : '⚪'} {opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text>Possui ambiente climatizado?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['Sim', 'Não'].map((opcao) => (
                <TouchableOpacity key={opcao} onPress={() => setValue('climatizado', opcao)}
                  style={{ marginRight: 20 }}>
                  <Text>{watch('climatizado') === opcao ? '🔘' : '⚪'} {opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text>É profissional de banho e tosa em domicílio?</Text>
            <View style={{ flexDirection: 'row' }}>
              {['sim', 'não'].map((opcao) => (
                <TouchableOpacity
                  key={opcao}
                  onPress={() => setValue('profissional', opcao)}
                  style={{ marginRight: 20 }}
                >
                  <Text>{watch('profissional') === opcao ? '🔘' : '⚪'} {opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Observação */}
            <Text>Escreva uma observação:</Text>
            <Controller
              control={control}
              name="observacao"
              render={({ field: { onChange, value } }) => (
                <TextArea placeholder="Digite aqui" onChangeText={onChange} value={value}
                  style={{ backgroundColor: '#F1F1F1', borderRadius: 10 }} />
              )}
            />

            {/* Fotos documentos */}
            <Text>Documentos (RG e Comp. de Residência)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[0, 1].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => pickImage('fotosDocumentos', index)}
                  style={{ width: 90, height: 90, backgroundColor: '#ddd', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                >
                  {(watch("fotosDocumentos")?.[index]) ? (
                    <Image source={{ uri: watch("fotosDocumentos")[index] }} style={{ width: 90, height: 90, borderRadius: 10 }} />
                  ) : (
                    <Text>+</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Fotos local */}
            <Text>Fotos do Local (3)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[0, 1, 2].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => pickImage('fotosLocal', index)}
                  style={{ width: 90, height: 90, backgroundColor: '#ddd', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                >
                  {(watch("fotosLocal")?.[index]) ? (
                    <Image source={{ uri: watch("fotosLocal")[index] }} style={{ width: 90, height: 90, borderRadius: 10 }} />
                  ) : (
                    <Text>+</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão próximo */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{ backgroundColor: '#1BC5B7', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center'  }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Próximo</Text>
            </TouchableOpacity>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default CadastroCuidador;
