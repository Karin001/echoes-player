import { PlayerSearchActions, CSearchTypes } from '../../core/store/player-search';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EchoesState } from '../../core/store';

// actions
import { NowPlaylistActions } from '../../core/store/now-playlist';
import { AppPlayerActions } from '../../core/store/app-player';
// selectors
import { getPlayerSearchResults$, getNowPlaylist$ } from '../../core/store/reducers';
import { getPlaylistVideos$ } from '../../core/store/now-playlist';
import { getIsSearching$ } from '../../core/store/player-search';

@Component({
  selector: 'youtube-videos',
  styleUrls: [ './youtube-videos.scss' ],
  template: `
    <loader [message]="'Loading Awesome Media Results'" [loading]="loading$ | async"></loader>
    <youtube-list
      [list]="videos$ | async"
      [queued]="playlistVideos$ | async"
      (play)="playSelectedVideo($event)"
      (queue)="queueSelectedVideo($event)"
      (unqueue)="removeVideoFromPlaylist($event)"
    ></youtube-list>
  `
})
export class YoutubeVideosComponent implements OnInit {
  videos$ = this.store.let(getPlayerSearchResults$);
  playlistVideos$ = this.store.let(getPlaylistVideos$);
  loading$ = this.store.let(getIsSearching$);

  constructor(
    private store: Store<EchoesState>,
    private nowPlaylistActions: NowPlaylistActions,
    private appPlayerActions: AppPlayerActions,
    private playerSearchActions: PlayerSearchActions
  ) { }

  ngOnInit() {
    this.store.dispatch(this.playerSearchActions.updateSearchType(CSearchTypes.VIDEO));
    this.store.dispatch(this.playerSearchActions.searchCurrentQuery());
  }

  playSelectedVideo (media: GoogleApiYouTubeVideoResource) {
    this.store.dispatch(this.appPlayerActions.loadAndPlay(media));
    this.store.dispatch(this.nowPlaylistActions.selectVideo(media));
  }

  queueSelectedVideo (media: GoogleApiYouTubeVideoResource) {
    this.store.dispatch(this.nowPlaylistActions.queueVideo(media));
  }

  removeVideoFromPlaylist(media: GoogleApiYouTubeVideoResource) {
    this.store.dispatch(this.nowPlaylistActions.removeVideo(media));
  }
}
