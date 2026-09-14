def remove_dupes(list):
    no_dupes = []
    for i in range(len(test)):
        if list[i] in no_dupes:
            no_dupes.append(list[i])
    return(no_dupes)



test = ["1", "1", "1", "2", "2", "3", "4", "5", "5", "5", "7", "8", "11", "11", "11", "12"]
remove_dupes(test)

