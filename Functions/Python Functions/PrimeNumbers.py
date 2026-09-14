def list_prime_numbers(limit):
    not_prime = []
    prime = []
    for all_numbers in range(2,limit):
        for y in range(1,1000):
            if (all_numbers / y) % 1 == 0 and y != 1 and y!=all_numbers:
                not_prime.append(all_numbers)
    for i in range(2,limit):
        if i not in not_prime:
            prime.append(i)
    print(prime)


list_prime_numbers(50)