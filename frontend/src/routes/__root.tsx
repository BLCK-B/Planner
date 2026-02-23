import {createRootRoute, createRoute, createRouter, Outlet} from '@tanstack/react-router'
import LandingPage from '@/pages/LandingPage.tsx'
import MainPage from '@/pages/main/MainPage.tsx'
import AuthPage from '@/pages/AuthPage.tsx'
import PlansPage from '@/pages/main/PlansPage.tsx'
import TagsEditPage from "@/pages/main/TagsEditPage.tsx";
import SettingsPage from "@/pages/settings/SettingsPage.tsx";
import WorklistPage from "@/pages/main/WorklistPage.tsx";
import WorklistSubtasksPage from "@/pages/main/WorklistSubtasksPage.tsx";

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

export const postAuthRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app/postauth',
    component: AuthPage,
})

export const mainRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app/tasks',
    component: MainPage,
})

export const plansRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app/plans',
    component: PlansPage,
})

export const worklistRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app/worklist',
    component: WorklistPage,
})

export const worklistSubtasksRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app/worklist/subtasks/$workItemId',
    component: WorklistSubtasksPage,
})

export const tagsEditRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app/tagsEdit',
    component: TagsEditPage,
})

export const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'app/settings',
    component: SettingsPage,
})

export const routeTree = rootRoute.addChildren(
    [
        landingRoute,
        postAuthRoute,
        mainRoute,
        plansRoute,
        worklistRoute,
        worklistSubtasksRoute,
        tagsEditRoute,
        settingsRoute,
    ])

export const router = createRouter({routeTree});