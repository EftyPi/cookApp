import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('test name', 'this is a test', 'https://gimmedelicious.com/wp-content/uploads/2020/01/30-Minute-Instant-Pot-Butter-Chicken-7.jpg')
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
