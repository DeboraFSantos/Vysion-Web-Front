<template>
    <div>
        <div class="logo-content">
            <img src="../assets/img/LOGO-VYSION.svg" class="logo-sidebar mb-3" alt="Logotipo" />
        </div>

        <nav>
            <ul class="main-menu">
                <router-link :to="{ name: 'summary' }">
                    <li :class="{ 'active': $route.name === 'summary' }">
                        <font-awesome-icon icon="chart-line" class="icon-sidebar" /> 
                        Dashboard
                    </li>
                </router-link>
                <router-link :to="{ name: 'sales' }">
                    <li :class="{ 'active': $route.name === 'sales' }">
                        <font-awesome-icon icon="cash-register" class="icon-sidebar" /> 
                        Vendas
                    </li>
                </router-link>
                <router-link :to="{ name: 'products' }">
                    <li :class="{ 'active': $route.name === 'products' }">
                        <font-awesome-icon icon="boxes-stacked" class="icon-sidebar" /> 
                        Produtos
                    </li>
                </router-link> 
                <router-link :to="{ name: 'categories' }">
                    <li :class="{ 'active': $route.name === 'categories' }"> 
                        <font-awesome-icon icon="rectangle-list" class="icon-sidebar" /> 
                        Categorias
                    </li>
                </router-link>
                <router-link :to="{ name: 'paymentMethods' }">
                    <li :class="{ 'active': $route.name === 'paymentMethods' }">
                        <font-awesome-icon icon="fa-credit-card" class="icon-sidebar" /> 
                        Pagamento
                    </li>
                </router-link>
                <router-link :to="{ name: 'clients' }">
                    <li :class="{ 'active': $route.name === 'clients' }">
                        <font-awesome-icon icon="fa-user" class="icon-sidebar" /> 
                        Clientes
                    </li>
                </router-link>
                <router-link :to="{ name: 'sellers' }">
                    <li :class="{ 'active': $route.name === 'sellers' }">
                        <font-awesome-icon icon="fa-user-tie" class="icon-sidebar" /> 
                        Usuários
                    </li>
                </router-link>
            </ul>
        </nav>
    </div>
</template>

<style lang="scss" scoped>
    .logo-content {
        text-align: center;
        margin:10px 0;
        .logo-sidebar {
            width:170px;
        }
    }

    .main-menu {
        text-decoration: none !important;
        list-style-type: none;

        li {
           color:#a6a5ab;
           padding:12px 20px;
           font-size:17px;
           margin-bottom:10px;
           cursor: pointer;

           &:hover {
            background-color: #f3f3f3;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            transition:0.5s;
           }
        }
        .active {
            border-right: 3px solid $primary-color;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            color:#3a3a3a;
            font-weight: 600;

            svg {
                color:$primary-color !important;
            }
        }

        .icon-sidebar {
            margin-right: 10px;
            width:16px;
        }
    }
</style>