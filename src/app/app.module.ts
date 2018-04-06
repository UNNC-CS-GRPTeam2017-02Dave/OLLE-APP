import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChatPage } from '../pages/chat/chat';
import { ChatGenSettingsPage } from '../pages/chat-gen-settings/chat-gen-settings';
import { ChatNewFormPage } from '../pages/chat-new-form/chat-new-form';
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
import { GenericProvider } from '../providers/generic/generic';
import { HttpModule } from '@angular/http';
import { NgCalendarModule } from 'ionic2-calendar';
import { ContentDrawer } from '../components/content-drawer/content-drawer';

// TingTing
import { NewtopicPage } from '../pages/newtopic/newtopic';
import { ForumService } from '../providers/forum-service/forum-service';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
//import { NewreplypostPage} from '../pages/newreplypost/newreplypost';
import { PostService} from '../providers/post-service/post-service';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AccountPage,
    AccountUpdateDataPage,
    AccountUpdatePasswordPage,
    ChatPage,
    ChatGenSettingsPage,
    ChatNewFormPage,
    InstantMessagingPage,
    CalendarPage,
    ForumPage,
    RegisterPage,
    TabsPage,
    ContentDrawer,
    NewtopicPage,
    ItemDetailPage
  ],
  imports: [
    BrowserModule, HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    IonicPageModule.forChild(ChatGenSettingsPage),
    IonicPageModule.forChild(ChatNewFormPage)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AccountPage,
    AccountUpdateDataPage,
    AccountUpdatePasswordPage,
    ChatPage,
    //ChatGenSettingsPage,
    //ChatNewFormPage,
    InstantMessagingPage,
    CalendarPage,
    ForumPage,
    RegisterPage,
    TabsPage,
    NewtopicPage,
    ItemDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GenericProvider,
    ForumService,
    PostService
  ]
})
export class AppModule {}
