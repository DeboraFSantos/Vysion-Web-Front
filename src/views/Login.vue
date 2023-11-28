<template>
    <div class="login-screen">
      <div class="login-aside">
        <img src="../assets/img/erp-login.svg" alt="ERP" />
      </div>
      <div class="d-flex align-items-center justify-content-center info-total">
        <div class="login-infos">
          <img src="../assets/img/LOGO-VYSION.svg" class="mb-3" alt="Logotipo" />

          <h1 class="pt-3">Login</h1>
          <p class="pt-3 pb-3">Seja bem-vindo! Por favor, faça login para acessar sua conta.</p>

          <div class="login-form">
            
            <form @submit.prevent="loginUser" autocomplete="on">
              <InputComponent 
                label-name="E-mail"
                :isRequired="false"
                error-message="Error"
              >
                <input 
                  type="email"
                  v-model="login.email"
                  autocomplete="on"
                />
              </InputComponent>
              <InputComponent label-name="Senha">
                <input 
                  type="password"
                  v-model="login.password"
                  autocomplete="on"
                />
              </InputComponent>
              <button class="primary w-100 mt-3 mb-4" type="submit">
                <font-awesome-icon icon="spinner" class="icon-login" v-if="isLoading"/> 
                Entrar
              </button>
            </form>

            <p class="text-center mb-4">Ou</p>

            <button class="border w-100 d-flex align-items-center justify-content-center" @click="signInWithGoogle">
              <img src="../assets/img/google-icon.svg" class="google-icon" alt="Logotipo" />
              Entre com o Google
            </button>

            <div class="mt-5">
              <p>Novo usuário? <b class="c-pointer" @click="redirectToOtherRoute">Cadastre-se</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import InputComponent from '@/components/form/Input.vue'
import router from '@/router';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup, getIdToken } from 'firebase/auth';
import iziToast from 'izitoast';
import { useSellerStore } from '@/stores/sellers.js'

const login = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false);
const auth: any = getAuth();
const sellerStore = useSellerStore();
const sellerData = ref();

const redirectToOtherRoute = () => {
  router.push('/sign-up');
};


const getSellerByEmail = (email: string) => {
    sellerStore.getSellerByEmail({
        email: email
    })
    .then((response) => {
      localStorage.setItem('currentUser', JSON.stringify(response));
    })
}

const loginUser = async () => {
  isLoading.value = true;

  try {
    const userCredential: any = await signInWithEmailAndPassword(auth, login.email, login.password);
    const userEmail = userCredential.user.email;

    const token = await auth.currentUser.getIdToken();
    localStorage.setItem('token', token);

    sellerStore.getSellerByEmail({
        email: userEmail
    })
    .then((response) => {
      localStorage.setItem('currentUser', JSON.stringify(response));

      if(response !== undefined) {
        isLoading.value = false;
        router.push('/summary');
      } else {
        isLoading.value = false;
        iziToast.error({
          title: 'Erro:',
          message: 'Usuário não encontrado',
          position: 'bottomCenter'
        })
      }
    })
  }
  catch(error: any) {
    isLoading.value = false;
    switch (error.code) {
      case "auth/invalid-email":
        iziToast.error({
          title: 'Erro:',
          message: 'E-mail inválido',
          position: 'bottomCenter'
        })
        break;
      case "auth/user-not-found":
        iziToast.error({
          title: 'Erro:',
          message: 'Nenhuma conta está vinculada a esse e-mail',
          position: 'bottomCenter'
        })
        break;
      case "auth/wrong-password":
        iziToast.error({
          title: 'Erro:',
          message: 'Senha incorreta',
          position: 'bottomCenter'
        })
        break;
      default:
        iziToast.error({
          title: 'Erro:',
          message: 'E-mail ou senha incorretos',
          position: 'bottomCenter'
        })
        break;
    }
  }
}

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
      const userCredential: any = await signInWithPopup(getAuth(), provider);
      const userEmail = userCredential.user.email;

      const token = await auth.currentUser.getIdToken();
      localStorage.setItem('token', token);

      sellerStore.getSellerByEmail({
        email: userEmail
      })
      .then((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));

        isLoading.value = false;
        router.push('/summary');
      })
      .catch((error) => {
        iziToast.error({
          title: 'Erro:',
          message: 'Usuário não encontrado',
          position: 'bottomCenter'
        })
      })
  }
  catch(error: any) {
    iziToast.error({
        title: 'Erro:',
        message: 'Erro ao logar com Google',
        position: 'bottomCenter'
      })
  }
}
</script>

<style lang="scss" scoped>
.login-screen {
  display: flex;
  width:100vw;
  flex-wrap: wrap;
  width:100%;

  .info-total {
    flex-basis:60%;

    @media screen and (max-width:700px){
      flex-basis:100%;
      padding:20px;
    }
  }
  .login-aside {
    background: $primary-color;
    height:auto; 
    flex-basis:40%;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width:60%;
    }

    @media screen and (max-width:700px){
      flex-basis:100%;
      height:250px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-bottom-right-radius: 40px;
      border-bottom-left-radius: 40px;

      img {
        max-width:50%;
      }
    }
  }
  .login-infos {
    height:100vh; 
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width:50%;

    img {
      max-width:140px;
      margin-left:-5px;
    }

    .login-form {
      width:100%;
    }
    
    @media screen and (max-width:700px){
      width:100%;
      height:100%; 
    }
  }
}
.google-icon {
  width: 25px;
  margin-right:8px;
}
.c-pointer {
  cursor: pointer;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.icon-login {
  animation: spin 1s linear infinite;
}
</style>
  