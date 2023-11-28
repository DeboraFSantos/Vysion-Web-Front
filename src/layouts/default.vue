<template>
  <div class="all-menu-mobile" @click="closeMobileMenu"></div>

  <div v-if="isMobileMenuOpen" class="mobile-menu-container">
    <SidebarComponent></SidebarComponent>
  </div>

  <div class="dashboard" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <div class="sidebar sidebar-desktop" :class="{ 'sidebar-hidden': sidebarHidden }">
      <SidebarComponent v-if="!sidebarHidden"></SidebarComponent>
    </div>

    <div class="main-content">

      <div class="top-bar">
          <div class="mobile-menu" @click="toggleMobileMenu()">
            <font-awesome-icon icon="bars" class="icon-menu" /> 
          </div>
          
          <div>
              <font-awesome-icon icon="bars" class="icon-menu" @click="toggleSidebar" v-if="sidebarHidden" /> 
          </div>

          <div class="user-info" @mouseover="showUserMenu" @mouseleave="hideUserMenu">
              <div class="user-photo"> 
                {{getInitials(currentUser?.name || '')}}
         
              </div>
              <font-awesome-icon icon="chevron-down" class="icon-user"/> 
              <div class="user-menu" v-show="isUserMenuOpen" ref="userMenu" @mouseleave="hideUserMenu" @click="toggleUserMenu">
                <div class="logged-user">
                  {{ currentUser?.name }}
                </div>

                <div class="logout" @click="handleSignOut">
                  Sair
                </div>
              </div>
          </div>
      </div>

      <div class="content">
        <slot></slot>
      </div>
      
    </div>
  </div>
</template>
  
<script lang="ts" setup>
  import { onMounted, onBeforeUnmount, reactive, ref, watch, onUpdated } from 'vue';
  import SidebarComponent from '@/components/Sidebar.vue';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import router from '@/router';

  const isLoggedIn = ref(false);

  const auth = ref();
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser') || 'null'));

  onMounted(() => {
    auth.value = getAuth();

    onAuthStateChanged(auth.value, (user: any) => {
      if(user) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    })
  })

  const handleSignOut = () => {
    const auth = ref(getAuth());
    signOut(auth.value).then(() => {
      router.push('/login');
    })
  }

  let sidebarHidden = ref(false);
  let isMobileMenuOpen = ref(false);
  const isUserMenuOpen = ref(false);

  const toggleSidebar = () => {
    sidebarHidden.value = !sidebarHidden.value;
  };
  

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    const allMobileMenuContainer = document.querySelector('.all-menu-mobile');

    if(isMobileMenuOpen.value){
      // @ts-ignore
        allMobileMenuContainer.style.display = 'block';
    }
  };

  const hideUserMenu = () => {
    isUserMenuOpen.value = false;
  };

  const showUserMenu = () => {
    isUserMenuOpen.value = true;
  };
  
  const closeMobileMenu = (event: MouseEvent) => {
    if (isMobileMenuOpen.value) {
      const target = event.target as HTMLElement;
      
      const mobileMenuContainer = document.querySelector('.mobile-menu-container');
        const allMobileMenuContainer = document.querySelector('.all-menu-mobile');
      
      if (mobileMenuContainer && !mobileMenuContainer.contains(target)) {
        isMobileMenuOpen.value = false;
        // @ts-ignore
        allMobileMenuContainer.style.display = 'none';
      }
    }
  };

  const toggleUserMenu = async () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
  }

  function getInitials(fullName:string) {
    const nameParts = fullName.split(' ');

    let firstInitial = '';
    let secondInitial = '';

    if (nameParts.length > 0) {
      firstInitial = nameParts[0].charAt(0).toUpperCase();

      if (nameParts.length > 1) {
        secondInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
      }
    }

    const initials = firstInitial + secondInitial;

    return initials;
  }
</script>
  
<style lang="scss" scoped>
  .dashboard {
    display: flex;
    height: 100vh;
    position: relative;
  }
  
  .sidebar {
    width: 280px;
    flex: 0 0 auto;
    transition: width 0.3s ease;
    background-color: white;
  }
  
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #fbfbfd;
  }
  
  .top-bar .user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    cursor: pointer;
  }

  .icon-menu {
    font-size:24px;
    color:$primary-color;
    cursor: pointer;
  }

  .icon-user {
    font-size:12px;
    margin-left:8px;
    color:#6e6f74;
    font-weight: 600;
    cursor: pointer;
  }

  .user-photo {
    background:$primary-color;
    color:white;
    width:42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius:100px;
    font-size: 14px;
  }

  .user-menu {
    background:white;
    position: absolute;
    right:-11px;
    top:40px;
    width:280px;
    height:auto;
    border-radius: 8px;
    box-shadow: 1px 0px 13px -2px rgba(0,0,0,0.08);
    -webkit-box-shadow: 1px 0px 13px -2px rgba(0,0,0,0.08);
    -moz-box-shadow: 1px 0px 13px -2px rgba(0,0,0,0.08);
    cursor:default;
    transition:opacity 0.2s ease-in-out, top 0.2s ease-in-out;
    opacity:1;

    &::after {
      content: '';
      position: absolute;
      width: 0; 
      height: 0; 
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid white;
      top:-7px;
      right:9px;
    }

    .logged-user {
      padding:15px;
    }
    .logout {
      border-top:1px solid #eee;
      padding:15px;
      font-size: 13px;
      font-weight: 500;
      cursor:pointer;
    }
  }
  .sidebar-hidden {
    width: 50px;
    overflow: hidden;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .content {
    flex-grow: 1;
    display: flex;
    background-color: #f5f6fb;
  }
  
  p {
    margin-bottom: 0;
  }
  
  .sidebar-desktop {
    display: block;
  }
  
  .mobile-menu, .mobile-menu-container {
    display: none;
  }
  
  @media screen and (max-width: 700px) {
    .sidebar-desktop {
      display: none;
    }
  
    .top-bar {
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }
  
    .mobile-menu {
      display: block;
    }

    .all-menu-mobile {
        width: 10%;
        position: absolute;
        z-index: 10000;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        top: 0;
        right: 0;
        display: none;
    }   

    .mobile-menu-container {
        display: block;
        position: absolute;
        width: 85%;
        height: 100vh;
        background-color: white;
        z-index: 1000;
        overflow: hidden;
    }
    
    .dashboard.mobile-menu-open::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
  }
</style>
  