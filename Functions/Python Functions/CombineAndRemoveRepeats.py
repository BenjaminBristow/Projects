def list_overlap(list1, list2):
    overlap = []
    for index in range(len(list1)):
        if list1[index] in list2:
            overlap.append(list1[index])

    print(overlap)




test1 = ["1", "2", "3", "4"]
test2 = ["3", "4", "5", "6"]
list_overlap(test1, test2)