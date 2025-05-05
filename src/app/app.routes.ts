import { Routes } from '@angular/router';
import { RootComponent } from './components/main/root/root.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/core/login/login.component').then(m => m.LoginComponent), pathMatch: 'full', canActivate: [LoginGuard] },
    { path: 'forgot-password', loadComponent: () => import('./components/core/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent), canActivate: [LoginGuard] },
    {
        path: 'otp-verification', loadComponent: () => import('./components/core/otp-verification/otp-verification.component').then(m => m.OtpVerificationComponent), canActivate: [LoginGuard]
    },
    {
        path: 'reset-password', loadComponent: () => import('./components/core/reset-password/reset-password.component').then(m => m.ResetPasswordComponent), canActivate: [LoginGuard]
    },
    {
        path: 'reset-success', loadComponent: () => import('./components/core/reset-success/reset-success.component').then(m => m.ResetSuccessComponent), canActivate: [LoginGuard]
    },
    {
        path: 'home',
        component: RootComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
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
                path: 'auther-detail', loadComponent: () => import('./components/main/authers/author-detail/author-detail.component').then(m => m.AuthorDetailComponent)
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
                path: 'e-book-detail', loadComponent: () => import('./components/main/e-book/book-details/book-details.component').then(m => m.BookDetailsComponent)
            },
            {
                path: 'add-e-book', loadComponent: () => import('./components/main/e-book/add-book/add-book.component').then(m => m.AddBookComponent)
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
            {
                path: 'genre-management', loadComponent: () => import('./components/main/genres/genres.component').then(m => m.GenresComponent)
            },
        ]
    },
];
