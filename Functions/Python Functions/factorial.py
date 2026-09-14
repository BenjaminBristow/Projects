def factorialReccursion(n):
    if n<0:
        print("ERROR: number must not be negative")
        return -1

    if n>0:
        total = n * factorialReccursion(n-1)
        return total
    else:
        return 1


def factorialNoReccursion(n):
    total = 1

    while n>0:
        total *= n
        n=n-1
    
    return total


print(factorialReccursion(10))
print(factorialNoReccursion(10))