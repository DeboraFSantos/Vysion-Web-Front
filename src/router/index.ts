import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Summary from '../views/Summary/Summary.vue'
import Products from '../views/Products/ProductsList.vue'
import ProductsAdd from '../views/Products/ProductAdd.vue'
import ProductEdit from '../views/Products/ProductEdit.vue'
import ProductDetails from '../views/Products/ProductDetails.vue'
import Categories from '../views/Categories/CategoriesList.vue'
import CategoryAdd from '../views/Categories/CategoryAdd.vue'
import CategoryEdit from '../views/Categories/CategoryEdit.vue'
import CategoryDetails from '../views/Categories/CategoryDetails.vue'
import Clients from '../views/Clients/ClientsList.vue'
import ClientAdd from '../views/Clients/ClientAdd.vue'
import ClientEdit from '../views/Clients/ClientEdit.vue'
import ClientDetails from '../views/Clients/ClientDetails.vue'
import PaymentMethods from '../views/PaymentMethods/PaymentMethodsList.vue'
import PaymentMethodAdd from '../views/PaymentMethods/PaymentMethodAdd.vue'
import PaymentMethodEdit from '../views/PaymentMethods/PaymentMethodEdit.vue'
import PaymentMethodDetails from '../views/PaymentMethods/PaymentMethodDetails.vue'
import Sellers from '../views/Sellers/SellersList.vue'
import SellerAdd from '../views/Sellers/SellerAdd.vue'
import SellerEdit from '../views/Sellers/SellerEdit.vue'
import SellerDetails from '../views/Sellers/SellerDetails.vue'
import Sales from '../views/Sales/SalesList.vue'
import SaleAdd from '../views/Sales/SaleAdd.vue'
import SaleEdit from '../views/Sales/SaleEdit.vue'
import SaleDetails from '../views/Sales/SaleDetails.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import iziToast from 'izitoast'
import { helpers } from '@/utils/helpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: Register
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sales,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sale/add',
      name: 'sale-add',
      component: SaleAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sale/:id/edit',
      name: 'edit-sale',
      component: SaleEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sale/:id/details',
      name: 'sale-details',
      component: SaleDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/products',
      name: 'products',
      component: Products,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/product/add',
      name: 'product-add',
      component: ProductsAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/product/:id/edit',
      name: 'edit-product',
      component: ProductEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/product/:id/details',
      name: 'product-details',
      component: ProductDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/category/add',
      name: 'category-add',
      component: CategoryAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/category/:id/edit',
      name: 'edit-category',
      component: CategoryEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/category/:id/details',
      name: 'category-details',
      component: CategoryDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/clients',
      name: 'clients',
      component: Clients,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/client/add',
      name: 'client-add',
      component: ClientAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/client/:id/edit',
      name: 'edit-client',
      component: ClientEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/client/:id/details',
      name: 'client-details',
      component: ClientDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sellers',
      name: 'sellers',
      component: Sellers,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/seller/add',
      name: 'seller-add',
      component: SellerAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/seller/:id/edit',
      name: 'edit-seller',
      component: SellerEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/seller/:id/details',
      name: 'seller-details',
      component: SellerDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/paymentMethods',
      name: 'paymentMethods',
      component: PaymentMethods,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/paymentMethod/add',
      name: 'paymentMethod-add',
      component: PaymentMethodAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/paymentMethod/:id/edit',
      name: 'edit-paymentMethod',
      component: PaymentMethodEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/paymentMethod/:id/details',
      name: 'paymentMethod-details',
      component: PaymentMethodDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/:catchAll(.*)",
      redirect: { name: 'login' }
    }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const currentRole = helpers.getCurrentUser();
  const user = await getCurrentUser();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (user) {
      if (
        to.name !== 'summary' &&
        currentRole.role !== 'admin' &&
        currentRole.role !== 'seller'
      ) {
        iziToast.error({
          title: 'Erro:',
          message: 'Você não tem acesso a essa página, contate o administrador',
          position: 'bottomCenter'
        });
        next(false);
      } else {
        next();
      }
    } else {
      iziToast.error({
        title: 'Erro:',
        message: 'Você não tem acesso a essa página, contate o administrador',
        position: 'bottomCenter'
      });
      next('/login');
    }
  } else {
    next();
  }
});

export default router
