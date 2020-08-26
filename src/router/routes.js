
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'novaClinica', component: () => import('pages/clinica/novaClinica.vue')}
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
