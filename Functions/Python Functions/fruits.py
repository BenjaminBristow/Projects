from functools import reduce

fruits = [
{"name": "Apple", "price": 1.00, "quantity": 5},
{"name": "Banana", "price": 0.50, "quantity": 10},
{"name": "Orange", "price": 1.50, "quantity": 3},
{"name": "Grapes", "price": 2.00, "quantity": 2},
{"name": "Watermelon", "price": 3.00, "quantity": 1}
]

total_costs = list(map(lambda fruit: fruit["price"] * fruit["quantity"], fruits))
print(total_costs) # [5.0, 5.0, 4.5, 4.0, 3.0]

fruits_with_quantity_3_or_more = list(filter(lambda fruit: fruit["quantity"]>=3, fruits))
print(fruits_with_quantity_3_or_more) # [{"name": "Apple",...}, {"name": "Banana",...},

average_price = reduce(lambda total, fruit: total + fruit["price"], fruits, 0)/len(fruits)
print(average_price) # 1.6

most_expensive_fruit = max(fruits, key=lambda fruit: fruit["price"])
print(most_expensive_fruit) # {"name": "Watermelon", "price": 3.00, "quantity": 1}


fruit_dictionary = {}
for fruit in fruits:
    fruit_dictionary.update({fruit["name"]: fruit["price"]})
print(fruit_dictionary)