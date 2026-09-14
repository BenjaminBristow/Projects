def is_palindrome(word):
    length = len(word)
    if length % 2 == 0:
        midpoint = length / 2
        x=0
        while x < midpoint:
            if word[x] == word[-x-1]:
                x+=1
                palindrome = True
            else:
                palindrome = False
                break
    else:
        midpoint = (length / 2) + 0.5
        x = 0
        while x < midpoint:
            if word[x] == word[-x-1]:
                x+=1
                palindrome = True
            else:
                palindrome = False
                break

    if palindrome == True:
        print("yes")
    else:
        print("no")



is_palindrome("racecar")




