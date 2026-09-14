def fibonacci_sequence(num):
    fibonacci = ["0", "1"]
    for i in range(num-2):
        next = int(fibonacci[-1]) + int(fibonacci[-2])
        fibonacci.append(next)
    print(fibonacci)




fibonacci_sequence(10)