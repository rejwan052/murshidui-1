import { Component, OnInit } from '@angular/core';
import {MeaningScreen} from '../../models/MeaningScreen';
import {SongsService} from '../../services/songs.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dictionary-definition',
  templateUrl: './dictionary-definition.component.html',
  styleUrls: ['./dictionary-definition.component.scss']
})
export class DictionaryDefinitionComponent implements OnInit {

  constructor(    public dialogRef: MatDialogRef<DictionaryDefinitionComponent>, public songsService: SongsService ) {



  }

  meaningScreen = new MeaningScreen();

  ngOnInit(): void {
    this.meaningScreen = this.songsService.meaningScreen;
  }

  getEntries(map: Map<string, string>): [string, string] [] {
    if (map) {
      return Array.from(map.entries());
    } else {
      return [];
    }
  }

  close(): void {
    this.dialogRef.close() ;
  }

}
