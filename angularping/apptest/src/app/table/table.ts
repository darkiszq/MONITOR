import { Component,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

interface Data{
    [key: string]: any
    domain : string;
    time : string;
    online : string;

}

interface Resp{
  result : Array<Data>
}

@Component({
  selector: 'app-table',
  standalone : true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  audio: HTMLAudioElement | null = null;

  columns = ['domain', 'time', 'online'];

  isUpdated = signal(true);

  setHeader(title : any ,index: any) {
    return title;
  }

  setData(data :any  , title: any) {
    if(!title) return "Hi"
    return data;
  }

  data : Data[] = [] //= [
  //   {domain : "aaa",
  //     time: "bbbb",
  //     online : "cccc"
  //   }
  // ]

  private source = interval(10000);

  constructor(private _http: HttpClient, private cdr: ChangeDetectorRef) {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('toast_sound.mp3');
    }
    // Load data immediately on init
    this.loadData();

    // Then load every 10 seconds
    this.source.subscribe(() => this.loadData());
  }

  private async loadData() {
    try {
      this.isUpdated.set(false);

      const resp = await firstValueFrom(this._http.post<Resp>('/threelast', ""))
      console.log("RESPONSE", resp)

      const newData: Data[] = [];
      for(let row in resp.result) {
        let temp : Data = { domain : resp.result[row].domain.split('//')[1], time: resp.result[row].time ? resp.result[row].time.split('T')[1].split('.')[0] : 'N/A', online : (resp.result[row].online == "1" ? 'Online' : 'Offline')}
        console.log(temp.domain)
        newData.push(temp);
      }
      this.data = newData;
      this.cdr.markForCheck()

      // Wait for animation to complete (300ms) then reset

        this.isUpdated.set(true);


      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(err => console.log("Audio play error:", err));
      }
    }
    catch(err) {
      console.log("ERROR " + err)
    }
  }
 }
