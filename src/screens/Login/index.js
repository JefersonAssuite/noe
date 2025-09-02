import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Button, Pressable, Text, VStack } from 'native-base';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { auth } from '../../../services/FirebaseConfig';

const Login = () => {
  const router=useRouter()
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      senha: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.senha);
      console.log('Login efetuado com sucesso');
      router.replace('/(tabs)')
      // redirecionamento acontece automaticamente pelo _layout
    } catch (error) {
      console.error('Erro no login:', error.message);
      Alert.alert('Erro', 'Erro ao fazer login: ' + error.message);
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/NOÉ.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <Box p={6} w="90%" maxW="400" alignSelf="center">
          <Text fontSize="2xl" textAlign="center" mb={6} color="white">Entrar</Text>

          <VStack space={4}>
            <Controller
              control={control}
              rules={{
                required: 'O e-mail é obrigatório',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Digite um e-mail válido'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'white',
                    color: 'white',
                    fontSize: 16,
                    paddingVertical: 8,
                  }}
                  placeholder="E-mail"
                  placeholderTextColor="white"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text color="red.500" fontSize="xs">{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              rules={{
                required: 'A senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'white',
                    color: 'white',
                    fontSize: 16,
                    paddingVertical: 8,
                  }}
                  placeholder="Senha"
                  placeholderTextColor="white"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
              name="senha"
            />
            {errors.senha && (
              <Text color="red.500" fontSize="xs">{errors.senha.message}</Text>
            )}

            <Button
              onPress={handleSubmit(onSubmit)}
              bg="#ffcbdb"
              _pressed={{ bg: "#ffb3c9" }}
              _text={{ color: "white", fontWeight: "bold" }}
              mt={4}
            >
              Entrar
            </Button>

            <Pressable onPress={navigateToRegister} mt={4}>
              <Text color="#ffcbdb" textAlign="center">Não tem uma conta? Cadastre-se</Text>
            </Pressable>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Login;