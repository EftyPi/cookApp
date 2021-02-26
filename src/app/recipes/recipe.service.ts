import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({providedIn: 'root'})
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Beef Burger',
    //         'One of Bristol\'s best burger',
    //         'https://visitbristol.co.uk/dbimgs/Asado%20burger.jpg_tmp.jpg',
    //         [
    //             new Ingredient('Beef', 2),
    //             new Ingredient('Buns', 1)
    //         ]),
    //     new Recipe(
    //         'Butter Chicken',
    //         'A delicious butter chicken recipe',
    //         'https://gimmedelicious.com/wp-content/uploads/2020/01/30-Minute-Instant-Pot-Butter-Chicken-7.jpg',
    //         [
    //             new Ingredient('Chicken', 2),
    //             new Ingredient('Basmati', 1),
    //         ])
    // ];

    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService){}

    setRecipes(recipes: Recipe[]): void {
        this.recipes = recipes;
        this.recipesChanged.next(this.getRecipes());
    }

    getRecipes(): Recipe[] {
        // get a copy using slice
        return this.recipes.slice();
    }

    getRecipeById(id: number): Recipe {
        return this.recipes[id];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]): void {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe): void {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.getRecipes());
    }

    updateRecipe(index: number, newRecipe: Recipe): void {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.getRecipes());
    }

    deleteRecipe(index: number): void {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.getRecipes());
    }

}
