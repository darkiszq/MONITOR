import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { interval } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"


/**
 * Raport response blueprint
 */

interface RaportResponse {
  /**
 * Raport title
 */
  Title: string;

  /**
 * Raport data
 */
  result: Array<{
    Date: string;
    'Turned on': number;
    Domain: string;
  }>;
}

/**
 * Website stats component
 */

@Component({
  selector: 'app-bodystats',
  imports: [CommonModule],
  templateUrl: './bodystats.html',
  styleUrl: './bodystats.css',
  standalone: true
})



export class Bodystats {
   /**
     * @ignore
     */
  desk = signal('wait');
   /**
     * @ignore
     */
  ebicom = signal('wait');
   /**
     * @ignore
     */
  sdp = signal('wait');

   /**
     * @ignore
     */
  stoparr = Array(0.2, 0.3, .4)
   /**
     * domains in app in order
     */
  domainarr = Array("https://servicedesk.ebicom.pl", "https://ebicom.pl", "https://sdp.ebicom.pl")

  /**
     * Map for style cache
     */
  private _styleCache = new Map<number, {on: string, off: string}>();

   /**
     * On init, preloads styles
     */
  ngOnInit() {
    // Pre-load data
    this.preloadStyles();
    // Load PDFDocument dynamically
  }

   /**
     * @ignore
     */
  private source = interval(10000);

   /**
     * @ignore
     */
  constructor(private _http: HttpClient, private cdr: ChangeDetectorRef) {




    this.source.subscribe(() => {
      console.log("PING")

      this.pingProxied('/servicedesk').then((result) => {
        console.log('pingServicedesk result', result);
        if (result) {
          this.desk.set('ONLINE');
          console.log('/servicedesk');
          this.pingServerPayload("https://servicedesk.ebicom.pl", 1);
        } else {
          this.desk.set('OFFLINE');
          this.pingServerPayload("https://servicedesk.ebicom.pl", 0);
        }
      });
      this.pingProxied('/ebicom').then((result) => {
        console.log('pingServicedesk result', result);
        if (result) {
          this.ebicom.set('ONLINE');
          this.pingServerPayload("https://ebicom.pl", 1);
        } else {
          this.ebicom.set('OFFLINE');
          this.pingServerPayload("https://ebicom.pl", 0);
        }
      });
      this.pingProxied('/sdp').then((result) => {
        console.log('pingServicedesk result', result);
        if (result) {
          this.sdp.set('ONLINE');
          this.pingServerPayload("https://sdp.ebicom.pl", 1);
        } else {
          this.sdp.set('OFFLINE');
          this.pingServerPayload("https://sdp.ebicom.pl", 0);
        }
      });
    });
  }

    /**
 *
 * Pings website
 * @param {string} proxy proxy name for website in proxy.conf.json
 * @returns If got response
 * @example
 * let online;
 * constructor(private _http: HttpClient, private cdr: ChangeDetectorRef) {
    this.pingProxied('/servicedesk').then((result) => {
    online = result
    }};
    console.log(online);
 */

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


    /**
 *
 * Sends information about domain's activity to database
 * @param {string} domain domain for which its saving
 * @param {number} isup if website is online
 * @returns If successful
 * @example
 * constructor(private _http: HttpClient, private cdr: ChangeDetectorRef) {
    this.pingServerPayload('https://sdp.ebicom.pl', 0).then((result) => {
    console.log(result);
    }};


 */


  public async pingServerPayload(domain: string, isup: number): Promise<boolean> {
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

    /**
 *
 * Pre-loads piechart styles into website's chache
 * @returns Nothing
 */
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

    /**
 *
 * Asks backend server for piechart's style data
 * @param {string} domain domain for which its asking
 * @returns Percentage covered by first field of a piechart; if error occurs returns -1
 */
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
   /**
 * Asks backend server for raport and downloads it onto user's machine as a pdf file
 * @param {number} number number of which website in order in app it generates the raport of
 * @returns If successful
 * @example
 * <button (click)="raportDownload(0)">DOWNLOAD RAPORT</button>
*/

public async raportDownload(number : number){
      console.log("download!!!")
      let domain = this.domainarr[number]
      console.log("Domain is: " + domain + "on number " + number)
      let json;
      console.log(json)
      try{
      const payload = {domain : domain};
      const resp = await firstValueFrom(this._http.post<RaportResponse>('/raportfromdomain', payload))
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
      return false;
      }



      let textarray : string[][] = []

      json.result.forEach(element => {
        let online = element['Turned on'] == 1 ? 'Online' : 'Offline';
        textarray.push(Array(element.Date, online, element.Domain))
      });



      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(json.Title, 10, 10);
      doc.setFontSize(12);
      const headers = [["Date", "Online", "Domain"]];
      const data = textarray;
      autoTable(doc, {
        head: headers,
        body: data,
        startY: 30,
      });
      doc.save(json.Title+".pdf");




      // let jsonstring = JSON.stringify(json)
      // const blob = new Blob([jsonstring], { type: 'application/json' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'network_calls.json';
      // a.click();
      // window.URL.revokeObjectURL(url);

      return true;

  }
}
