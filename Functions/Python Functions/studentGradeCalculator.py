def average(grade1, grade2, grade3):
    return (grade1 + grade2 + grade3)/3



grade1 = int(input("What is the first grade: "))
grade2 = int(input("What is the second grade: "))
grade3 = int(input("What is the third grade: "))

if average(grade1, grade2, grade3) >= 40:
    print("you passed")
else:
    print("you failed")