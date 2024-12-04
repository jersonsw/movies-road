import {MoviesService} from './movies.service';
import {Observable, of} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MoviesTMDBImpl implements MoviesService{
    private httpClient = inject(HttpClient);

    find(): Observable<any> {
        return this.httpClient.get(environment.apiUrl, { observe: 'response' });
    }
}