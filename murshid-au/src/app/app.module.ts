import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTagsComponent } from './all-tags/all-tags.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MessagesComponent } from './messages/messages.component';
import { PagerComponent } from './pager/pager.component';
import { RegularCoverComponent } from './regular-cover/regular-cover.component';
import { ScriptSelectionComponent } from './script-selection/script-selection.component';
import { SelectorComponent } from './selector/selector.component';
import { SongComponent } from './song/song.component';
import { DictionaryDefinitionComponent } from './song/dictionary-definition/dictionary-definition.component';
import { LanguageLineComponent } from './song/language-line/language-line.component';
import { SongSelectorItemComponent } from './song-selector-item/song-selector-item.component';
import { SongplainComponent } from './songplain/songplain.component';
import { TagCoverComponent } from './tag-cover/tag-cover.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { WordCoverComponent } from './word-cover/word-cover.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SongsService} from './services/songs.service';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxYoutubePlayerModule} from 'ngx-youtube-player';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoadingComponent } from './loading/loading.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoadingService} from "./services/loading.service";


@NgModule({
  declarations: [
    AppComponent,
    AllTagsComponent,
    DictionaryComponent,
    MainNavComponent,
    MessagesComponent,
    PagerComponent,
    RegularCoverComponent,
    ScriptSelectionComponent,
    SelectorComponent,
    SongComponent,
    DictionaryDefinitionComponent,
    LanguageLineComponent,
    SongSelectorItemComponent,
    SongplainComponent,
    TagCoverComponent,
    TagsListComponent,
    WordCoverComponent,
    LoadingComponent
  ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatSelectModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        NgxYoutubePlayerModule,
        MatCheckboxModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        MatProgressSpinnerModule
    ],
  providers: [SongsService, LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
