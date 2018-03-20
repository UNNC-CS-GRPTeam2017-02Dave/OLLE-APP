import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChatPage } from '../pages/chat/chat';
import { InstantMessagingPage } from '../pages/chat-m/chat-m';
import { CalendarPage } from '../pages/calendar/calendar';
import { ForumPage } from '../pages/forum/forum';
import { AccountPage } from '../pages/account/account';
import { AccountUpdateDataPage } from '../pages/account-update-data/account-update-data';
import { AccountUpdatePasswordPage } from '../pages/account-update-password/account-update-password';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';
import { ContentDrawer } from '../components/content-drawer/content-drawer';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AccountPage,
    AccountUpdateDataPage,
    AccountUpdatePasswordPage,
    ChatPage,
    InstantMessagingPage,
    CalendarPage,
    ForumPage,
    RegisterPage,
    TabsPage,
    ContentDrawer
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AccountPage,
    AccountUpdateDataPage,
    AccountUpdatePasswordPage,
    ChatPage,
    InstantMessagingPage,
    CalendarPage,
    ForumPage,
    RegisterPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
  ]
})
export class AppModule {}
