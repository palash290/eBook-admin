import { Routes } from '@angular/router';
import { RootComponent } from './components/main/root/root.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/core/login/login.component').then(m => m.LoginComponent), pathMatch: 'full' },
    { path: 'forgot-password', loadComponent: () => import('./components/core/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
    {
        path: 'home',
        component: RootComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./components/main/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'authers', loadComponent: () => import('./components/main/authers/authers.component').then(m => m.AuthersComponent)
            },
            {
                path: 'chat-room', loadComponent: () => import('./components/main/chat-room/chat-room.component').then(m => m.ChatRoomComponent)
            },
            {
                path: 'chat-room-talk', loadComponent: () => import('./components/main/chat-room/talk/talk.component').then(m => m.TalkComponent)
            },
            {
                path: 'contact-us', loadComponent: () => import('./components/main/contact-us/contact-us.component').then(m => m.ContactUsComponent)
            },
            {
                path: 'e-book', loadComponent: () => import('./components/main/e-book/e-book.component').then(m => m.EBookComponent)

            },
            {
                path: 'order-history', loadComponent: () => import('./components/main/order-history/order-history.component').then(m => m.OrderHistoryComponent)
            },
            {
                path: 'order-history-details', loadComponent: () => import('./components/main/order-history/history-details/history-details.component').then(m => m.HistoryDetailsComponent)
            },
            {
                path: 'readers', loadComponent: () => import('./components/main/readers/readers.component').then(m => m.ReadersComponent)
            },
            {
                path: 'edit-profile', loadComponent: () => import('./components/main/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
            },
            {
                path: 'change-password', loadComponent: () => import('./components/main/change-password/change-password.component').then(m => m.ChangePasswordComponent)
            },
        ]
    },
];
