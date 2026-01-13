import { Component, signal } from '@angular/core';
import { Header} from './header/header';
import 'charts.css';
import { Bodystats } from "./bodystats/bodystats";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Bodystats],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {

}
