def egg_decoder(egg_code):
    if egg_code[0] == "0":
        print("Your egg was produced organically")
    elif egg_code[0] == "1":
        print("Your egg is free-range")
    elif egg_code[0] == "2":
        print("Your egg was produced in a barn")
    elif egg_code[0] == "3":
        print("Your egg was produced in a cage")
    else:
        print("that code might be incorrect")
    
    place = {"UK":"United Kingdom", "NL": "Netherlands", "FR": "France", "BE": "Belgium", "DE": "Germany", "ES": "Spain"}
    
    if egg_code[1:3] == "UK":
        print(f"Your egg was produced in the {place.get("UK")}")
    elif egg_code[1:3] == "NL":
        print(f"Your egg was produced in the {place.get("NL")}")
    elif egg_code[1:3] == "FR":
        print(f"Your egg was produced in the {place.get("FR")}")
    elif egg_code[1:3] == "BE":
        print(f"Your egg was produced in the {place.get("BE")}")
    elif egg_code[1:3] == "DE":
        print(f"Your egg was produced in the {place.get("DE")}")
    elif egg_code[1:3] == "ES":
        print(f"Your egg was produced in the {place.get("ES")}")
    else:
        print("that code might be incorrect")
    
    print(f"The producer ID is {egg_code[3:]}")