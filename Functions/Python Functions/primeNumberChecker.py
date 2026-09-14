def primeNumberChecker(n):
    divisible = []
    if n<0:
        print("number must be not be negative")
        return -1
    for i in range(n):
        if n%(i+1) == 0:
            divisible.append(i+1)
    if len(divisible)<=2:
        return n
    else:
        return -1

def listPrimeNumbers(n):
    primeNumbers = []
    for i in range(n):
        if primeNumberChecker(i)>0:
            primeNumbers.append(primeNumberChecker(i))

    print(primeNumbers)
    print("there are", len(primeNumbers), "prime numbers")

listPrimeNumbers(300)