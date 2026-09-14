class Pet:
    def __init__(self, name, age, species):
        self.name = name
        self.species = species

        if age < 0:
            raise ValueError("Age cannot be negative")
        self.age = age

    def stay(self, NumberOfDays):
        print(f"The pet is staying for {NumberOfDays} days")


class Dog(Pet):
    def __init__(self, name, age, species, breed):
        super().__init__(name, age, species)
        self.breed = breed
    
    def stay(self, NumberOfDays):
        print(f"The {self.breed} {self.name} is staying for {NumberOfDays} days")


pet = Pet("Fido", 3, "Cat")
pet.stay(5)
dog = Dog("Buddy", 2, "Dog", "Golden Retriever")
dog.stay(3)

try:
    pet = Pet("Fido", -1, "Cat")
except ValueError as e:
    print(e)