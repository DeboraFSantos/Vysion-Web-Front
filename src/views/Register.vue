<template>
    <div class="login-screen">
      <div class="login-aside">
        <img src="../assets/img/erp-login.svg" alt="ERP" />
      </div>
      <div class="d-flex align-items-center justify-content-center info-total">
        <div class="login-infos">
          <img src="../assets/img/LOGO-VYSION.svg" class="mb-3" alt="Logotipo" />

          <h1 class="pt-3">Cadastre-se</h1>
          <p class="pt-3 pb-3">Seja bem-vindo! Por favor, faça cadastra-se para acessar.</p>


          <div class="login-form">
            <form @submit.prevent="register" autocomplete="on">
              <InputComponent 
                label-name="Nome"
                :isRequired="false"
                error-message="Error"
              >
                <input 
                  v-model="login.name"
                />
              </InputComponent>
              <InputComponent 
                label-name="E-mail"
                :isRequired="false"
                error-message="Error"
              >
                <input 
                  type="email"
                  v-model="login.email"
                />
              </InputComponent>
              <InputComponent label-name="Senha">
                <input 
                  type="password"
                  v-model="login.password"
                />
              </InputComponent>
              <button class="primary w-100 mt-3 mb-4" type="submit">
                <font-awesome-icon icon="spinner" class="icon-login" v-if="isLoading"/> 
                Cadastrar
              </button>
            </form>

            <p class="text-center mb-4">Ou</p>

            <button class="border w-100 d-flex align-items-center justify-content-center" @click="signInWithGoogle">
              <img src="../assets/img/google-icon.svg" class="google-icon" alt="Logotipo" />
              Cadastre-se com o Google
            </button>

            <div class="mt-5">
              <p>Já tem uma conta? <b class="c-pointer" @click="redirectToOtherRoute">Faça login</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import InputComponent from '@/components/form/Input.vue'
import router from '@/router';
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import iziToast from 'izitoast';
import { useSellerStore } from '@/stores/sellers.js'

const login = reactive({
  name: "",
  email: "",
  password: ""
})

const userData = ref();
const sellerStore = useSellerStore();

const auth: any = getAuth();
const isLoading = ref(false);

const redirectToOtherRoute = () => {
  router.push('/login');
};

const body = reactive({
    name: "",
    email: "",
    phone: "",
    cpf:"",
    role:""
})

const createSeller = async (bodyInfo:any) => {
    isLoading.value = true;

    sellerStore.createSeller(bodyInfo)
    .then((response) => {
        isLoading.value = false;

        localStorage.setItem('userRole', JSON.stringify(response));
    })
    .catch((error) => {
        isLoading.value = false;

        iziToast.error({
            title: 'Erro:',
            message: 'Erro ao criar vendedor',
            position: 'bottomCenter'
        })
    })

}

const register = () => {
  isLoading.value = true;

  createUserWithEmailAndPassword(auth, login.email, login.password)
  .then((data) => {
    updateProfile(auth.currentUser, {
      displayName: login.name
    }).then(() => {
      body.name = login.name;
      body.email = login.email;
      body.role = "user";

      localStorage.setItem('currentUser', JSON.stringify(body));

      router.push('/summary');

      auth.currentUser.getIdToken()
        .then((token: any) => {
          localStorage.setItem('token', token);
          createSeller(body);
        })
        .catch((error: any) => {
          console.log(error)
        });

      isLoading.value = false;
    })
  })
  .catch((error) => {
    isLoading.value = false;

    switch (error.code) {
      case "auth/email-already-in-use":
        iziToast.error({
          title: 'Erro:',
          message: 'Usuário já existe',
          position: 'bottomCenter'
        })
        break;
      case "auth/weak-password":
        iziToast.error({
          title: 'Erro:',
          message: 'Senha fraca',
          position: 'bottomCenter'
        })
        break;
      case "auth/invalid-email":
        iziToast.error({
          title: 'Erro:',
          message: 'E-mail inválido',
          position: 'bottomCenter'
        })
        break;
      default:
        iziToast.error({
          title: 'Erro:',
          message: 'Erro ao criar usuário',
          position: 'bottomCenter'
        })
        break;
    }
  })
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
  .then((result) => {
    body.name = auth.currentUser.displayName;
    body.email = auth.currentUser.email;
    body.role = "user";

    localStorage.setItem('currentUser', JSON.stringify(body));

    router.push('/summary');

    auth.currentUser.getIdToken()
    .then((token: any) => {
        localStorage.setItem('token', token);
        createSeller(body);
    })
    .catch((error: any) => {
        console.log(error)
    });
  })
  .catch((error) => {
    iziToast.error({
        title: 'Erro:',
        message: 'Erro ao cadastrar com Google',
        position: 'bottomCenter'
      })
  })
}

</script>

<style lang="scss" scoped>
.login-screen {
  display: flex;
  width:100vw;
  flex-wrap: wrap;
  width:100%;

  .info-total {
    flex-grow: 1; /* Permitindo que cresça para preencher o espaço disponível */
    padding: 50px 0px; /* Ajuste de espaçamento */

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
    overflow: hidden; /* Escondendo qualquer conteúdo extra */

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
  