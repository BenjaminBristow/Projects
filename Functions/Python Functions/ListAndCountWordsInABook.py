reader = open('data/jekyll.txt')
punctuation = '.;,-“’”:?—‘!()_'

freq_dict = {}
for line in reader:
  for word in line.split():
    cleaned_word = word.lower().strip(punctuation)
    if cleaned_word in freq_dict:
      freq_dict[cleaned_word]+=1
    else:
      freq_dict[cleaned_word]=1

print(len(freq_dict))