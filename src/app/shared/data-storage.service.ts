import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService) {}

    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();
        this.http.put(
                'https://cookapp-fe812-default-rtdb.firebaseio.com/recipes.json',
                recipes
            )
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes(): Observable<Recipe[]> {
        // take 1 value and then automatically unsubscribe
        // exhaustMap waits for the user observable to complete and replaces the user observable with the new observable inside the function

        return this.http.get<Recipe[]>(
            'https://cookapp-fe812-default-rtdb.firebaseio.com/recipes.json'
        )
        .pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    // tranform every recipe
                    // in case a recipe doesn't have ingredients, set it to an empty array
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            // tap: execute code in place without altering the data
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}
