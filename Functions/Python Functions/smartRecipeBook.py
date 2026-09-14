class Recipe:
    def __init__(self, name, ingrediants, instructions):
        self.name = name
        self.ingrediants = ingrediants
        self.instructions = instructions

class Recipe_book:
    def __init__(self):
        self.recipes = []

    def search_by_ingrediant(desired_ingrediant):
        recipes_containing_ingrediant = []
        for recipe in recipe_book:
            for ingrediant in recipe.ingrediants:
                if ingrediant == desired_ingrediant:
                    recipes_containing_ingrediant.append(recipe.name)
        return recipes_containing_ingrediant

    def update_recipe(recipe_name, ingrediant):
        for recipe in recipe_book.recipes:
            if recipe.name == recipe_name:
                recipe.ingrediants.append(ingrediant)
                print(recipe.ingrediants)

PastaPrimavera = Recipe(
    "Pasta Primavera",
    ["pasta", "olive oil", "garlic", "vegetables"], 
    ["Cook pasta", "Heat olive oil", "Add garlic and vegetables", "Serve"])

ChickenFajitas = Recipe(
    "Chicken Fajitas", 
    ["chicken", "peppers", "onions", "tortillas"], 
    ["Grill chicken", "Sauté peppers and onions", "Assemble fajitas", "Serve"])

VeggieBurger = Recipe(
    "Veggie Burger", 
    ["black beans", "rice", "vegetables", "buns"], 
    ["Cook black beans", "Mix with rice and vegetables", "Form patties", "Grill and serve"])


recipe_book = []

recipe_book.recipes.append(PastaPrimavera)
recipe_book.recipes.append(ChickenFajitas)
recipe_book.recipes.append(VeggieBurger)

recipe_book.update_recipe("Veggie Burger", "meat")
