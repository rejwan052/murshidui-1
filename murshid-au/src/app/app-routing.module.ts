import {ModuleWithProviders, NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';




import {AllTagsComponent} from './all-tags/all-tags.component';
import {SongplainComponent} from './songplain/songplain.component';
import {RegularCoverComponent} from './regular-cover/regular-cover.component';
import {TagCoverComponent} from './tag-cover/tag-cover.component';
import {WordCoverComponent} from './word-cover/word-cover.component';
import {SongComponent} from './song/song.component';


const routes: Routes = [
  { path: 'all-tags', component: AllTagsComponent },

  { path: 'tag', component: TagCoverComponent},
  { path: 'tag/:tag', component: TagCoverComponent},
  { path: 'song/:script/:urlKey', component: SongComponent},
  { path: 'song/:urlKey', component: SongComponent, runGuardsAndResolvers: 'always'},
  { path: 'song-lyrics/:script/:urlKey', component: SongplainComponent, runGuardsAndResolvers: 'always'},
  { path: 'dictionary', component: WordCoverComponent},
  { path: 'dictionary/:word', component: WordCoverComponent},
  { path: '', pathMatch: 'full', component: RegularCoverComponent }
];


const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabled', onSameUrlNavigation: 'reload' });


@NgModule({
  imports: [ routing],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}





