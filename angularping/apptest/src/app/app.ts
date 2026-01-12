import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Heroes } from './heroes/heroes';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { interval } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import 'charts.css';
import { arrayBuffer } from 'node:stream/consumers';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Heroes],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  desk = signal('wait');
  ebicom = signal('wait');
  sdp = signal('wait');


  stoparr = Array(0.2, 0.3, .4)
  domainarr = Array("https://servicedesk.ebicom.pl", "https://ebicom.pl", "https://sdp.ebicom.pl")

  private _styleCache = new Map<number, {on: string, off: string}>();

  ngOnInit() {
    // Pre-load danych
    this.preloadStyles();
  }


  private source = interval(10000);

  constructor(private _http: HttpClient, private cdr: ChangeDetectorRef) {




    this.source.subscribe(() => {
      this.pingProxied('/servicedesk').then((result) => {
        console.log('pingServicedesk result', result);
        if (result) {
          this.desk.set('ONLINE');
          console.log('/servicedesk');
          this.pingServerPayload(4, 1);
        } else {
          this.desk.set('OFFLINE');
          this.pingServerPayload(4, 0);
        }
      });
      this.pingProxied('/ebicom').then((result) => {
        console.log('pingServicedesk result', result);
        if (result) {
          this.ebicom.set('ONLINE');
          this.pingServerPayload(6, 1);
        } else {
          this.ebicom.set('OFFLINE');
          this.pingServerPayload(6, 0);
        }
      });
      this.pingProxied('/sdp').then((result) => {
        console.log('pingServicedesk result', result);
        if (result) {
          this.sdp.set('ONLINE');
          this.pingServerPayload(5, 1);
        } else {
          this.sdp.set('OFFLINE');
          this.pingServerPayload(5, 0);
        }
      });
    });
  }

  // ng serve --proxy-config proxy.conf.json

  public async pingProxied(proxy: string): Promise<boolean> {
    try {
      const resp: any = await firstValueFrom(
        this._http.get(proxy, { observe: 'response', responseType: 'text' as 'json' })
      );
      return resp && resp.status === 200;
    } catch (err) {
      console.error('pingServicedesk failed', err);
      return false;
    }
  }

  public async pingServer(): Promise<boolean> {
    try {
      const resp = await firstValueFrom(this._http.post(`/server`, { ping: true }));

      console.log('JSON response:', resp);
      return true;
    } catch (jsonError: any) {
      console.log('JSON failed, trying as text...');

      try {
        const textResponse = await firstValueFrom(
          this._http.post(
            `/server`,
            { ping: true },
            {
              responseType: 'text',
            }
          )
        );
        console.log('Text response:', textResponse);
        return textResponse.trim().length > 0;
      } catch (textError) {
        console.error('Both JSON and text failed:', textError);
        return false;
      }
    }
  }

  public async pingServerPayload(domain: number, isup: number): Promise<boolean> {
    try {
      const payload = { domain, isup: isup === 1 };

      const resp = await firstValueFrom(this._http.post('/datainsert', payload));

      console.log(`Data inserted for domain ${domain}:`, resp);
      return true;
    } catch (err: any) {
      console.error(`Data insert failed for domain ${domain}:`, err);

      if (err instanceof HttpErrorResponse) {
        console.error('Error status:', err.status);
        console.error('Error body:', err.error);
        console.error('Error headers:', err.headers);
      }

      return false;
    }
  }

    async preloadStyles() {
    for (let i = 0; i < this.domainarr.length; i++) {
      const stop = await this.dataforstyle(this.domainarr[i]);
      this._styleCache.set(i, {
        on: `--start: 0.0; --end: ${stop}; --color: #00d4ff`,
        off: `--start: ${stop}; --end: 1; --color: #ff005e`
      });
    }
  }

  get onStyle() {
    return (number: number) => {
      const cached = this._styleCache.get(number);
      return cached?.on || '--start: 0.0; --end: 0; --color: #00d4ff';
    };
  }

  get offStyle() {
    return (number: number) => {
      const cached = this._styleCache.get(number);
      return cached?.off || '--start: 0; --end: 1; --color: #ff005e';
    };
  }


  public async dataforstyle(domain : string){
    try{

    const payload = {domain : domain};
    const resp = await firstValueFrom(this._http.post<{ result: number }>('/graphfromdomain', payload))

    return resp.result;

    }
    catch(err){
      console.error(`Data insert failed for domain ${domain}:`, err);
      if (err instanceof HttpErrorResponse) {
        console.error('Error status:', err.status);
        console.error('Error body:', err.error);
        console.error('Error headers:', err.headers);
      }
      return -1;
    }
  }

  public async raportDownload(number : number){
      console.log("download!!!")
      let domain = this.domainarr[number]
      let json;
      console.log(json)
      try{

      const payload = {domain : domain};
      const resp = await firstValueFrom(this._http.post('/raportfromdomain', payload))
        console.log(resp)
      json = resp;

      }
      catch(err){
      console.error(`Data raport failed for domain ${domain}:`, err);
      if (err instanceof HttpErrorResponse) {
        console.error('Error status:', err.status);
        console.error('Error body:', err.error);
        console.error('Error headers:', err.headers);
      }
      return -1;
      }

      let jsonstring = JSON.stringify(json)


      const blob = new Blob([jsonstring], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'network_calls.json';
      a.click();
      window.URL.revokeObjectURL(url);
      return 0;
  }
}
