import {createRootRoute, createRoute, createRouter, Outlet} from '@tanstack/react-router'
import LandingPage from '@/pages/LandingPage.tsx'
import MainPage from '@/pages/main/MainPage.tsx'
import AuthPage from '@/pages/AuthPage.tsx'
import PlansPage from '@/pages/main/PlansPage.tsx'
import TagsEditPage from "@/pages/main/TagsEditPage.tsx";
import SettingsPage from "@/pages/settings/SettingsPage.tsx";

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
    component: AuthPage,
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

export const tagsEditRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'tagsEdit',
    component: TagsEditPage,
})

export const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'settings',
    component: SettingsPage,
})

export const routeTree = rootRoute.addChildren(
    [
        landingRoute,
        authRoute,
        mainRoute,
        plansRoute,
        tagsEditRoute,
        settingsRoute,
    ])

export const router = createRouter({routeTree});