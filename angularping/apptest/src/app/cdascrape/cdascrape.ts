import { Component,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { interval } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cdascrape',
  imports: [],
  templateUrl: './cdascrape.html',
  styleUrl: './cdascrape.css',
})
export class Cdascrape {
  articles = signal("")
  text =`<style>
  h2, h3 {
  color: #444;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: lighter;
  text-align: left;
}
</style>`
  last = "s"

    private source = interval(10000);


  constructor(private _http: HttpClient, private cdr: ChangeDetectorRef) {

    this.source.subscribe(()=>{
      this.Scrape(this.last).then((result)=>{
        if(result.new = true && this.last != result.link){
          this.last = result.link

          console.log(result)

          let html = `<span> <h3> ${result.author}</h3> <br> <h2> <a href="${result.link}"> ${result.title} </a> </h2></span> `
          this.text += html;
          this.articles.set(this.text)

        }
        else{
          console.log("No new articles aviable")
        }


      })



    })



  }





public async Scrape(last :  string ) {
    try{
    const payload = {last : last};
    const resp = await firstValueFrom(this._http.post<{ ok : boolean, new : boolean, title : string, author : string, link : string }>('/scrape', payload))
    return resp;
    }
    catch(err){
      console.error(`SCRAPE FAILED`, err);
      if (err instanceof HttpErrorResponse) {
        console.error('Error status:', err.status);
        console.error('Error body:', err.error);
        console.error('Error headers:', err.headers);
      }
      return {ok:false, new:false, title :"old", author : "old", link : "old"};
    }
  }



}


