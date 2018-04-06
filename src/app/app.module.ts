import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChatPage } from '../pages/chat/chat';
import { CalendarPage } from '../pages/calendar/calendar';
import { ForumPage } from '../pages/forum/forum';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';

// Components
import { ContentDrawer } from '../components/content-drawer/content-drawer';


//new
import { NewtopicPage} from '../pages/forum-newtopic/forum-newtopic';
import { ItemDetailPage} from '../pages/forum-item-detail/forum-item-detail';
import { ForumReplyPage} from '../pages/forum-reply-modal/forum-reply-modal';
import { GenericProvider} from '../providers/generic/generic';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AccountPage,
    ChatPage,
    CalendarPage,
    ContentDrawer,
    ForumPage,
    RegisterPage,
    TabsPage,
	NewtopicPage,
	ItemDetailPage,
	ForumReplyPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AccountPage,
    ChatPage,
    CalendarPage,
    ForumPage,
    RegisterPage,
    TabsPage,
	NewtopicPage,
	ItemDetailPage,
	ForumReplyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
	GenericProvider
  ]
})
export class AppModule {}
