import {createRootRoute, createRoute, createRouter, Outlet} from '@tanstack/react-router'
import LandingPage from '@/pages/LandingPage.tsx'
import MainPage from '@/pages/main/MainPage.tsx'
import Auth from '@/pages/Auth.tsx'
import PlansPage from '@/pages/main/PlansPage.tsx'

export const rootRoute = createRootRoute({
    component: () => (
        <Outlet/>
    ),
});

export const landingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
});

export const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'auth/$formType',
    component: Auth,
})

export const mainRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'main',
    component: MainPage,
})

export const plansRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'plans',
    component: PlansPage,
})

export const routeTree = rootRoute.addChildren([landingRoute, authRoute, mainRoute, plansRoute])

export const router = createRouter({routeTree});