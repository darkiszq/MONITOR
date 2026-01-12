import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header} from './header/header';

import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { interval } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import 'charts.css';
import { Bodystats } from "./bodystats/bodystats";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Bodystats],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {

}
