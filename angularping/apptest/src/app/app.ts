import { Component, signal } from '@angular/core';
import { Header} from './header/header';
import 'charts.css';
import { Bodystats } from "./bodystats/bodystats";

/**
 * Main app component
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Bodystats],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
/**
     * @ignore
     */
export class App {
    // ng serve --proxy-config proxy.conf.json
}
