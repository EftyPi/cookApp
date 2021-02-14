import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn:'root'})
export class RecipeService{
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            'test name', 
            'this is a test', 
            'https://gimmedelicious.com/wp-content/uploads/2020/01/30-Minute-Instant-Pot-Butter-Chicken-7.jpg', 
            [
                new Ingredient('Meat',1),
                new Ingredient('Rice',1)
            ]),
        new Recipe(
            'Another test name', 
            'this is a new test', 
            'https://gimmedelicious.com/wp-content/uploads/2020/01/30-Minute-Instant-Pot-Butter-Chicken-7.jpg',
            [
                new Ingredient('Chicken',1),
                new Ingredient('Basmati',1),
            ])
    ];

    constructor(private slService: ShoppingListService){}

    getRecipes(){
        // get a copy using slice
        return this.recipes.slice();
    }

    getRecipById(id: number){
        return this.recipes[id];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

}