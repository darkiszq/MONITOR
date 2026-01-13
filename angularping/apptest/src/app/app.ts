import { Component, signal } from '@angular/core';
import { Header} from './header/header';
import 'charts.css';
import { Bodystats } from "./bodystats/bodystats";
import { Cdascrape } from "./cdascrape/cdascrape";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Bodystats, Cdascrape],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {

}
