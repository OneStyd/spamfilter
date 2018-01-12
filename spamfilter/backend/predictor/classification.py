
import json, os, sys, stat
import re
from collections import defaultdict
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize 
import nltk
import enchant
import csv
import copy


def CleanData (text):
    result = re.sub(r'((\w+:\/{2}[\d\@\w-]+|www\.[\w-]+)+(\.[\d\w-]+)*(?:(?:\/[^\s\/]*))*|([\w]+-\w+@[\w-]+|\w+@[\w-]+)+(\.[\d\w-]+)*(?:(?:\/[^\s\/]*))*)', ' ', text)
    result = re.sub("<(?:.|\n)*?>", " ", result)
    result = re.sub("[^a-zA-Z]", " ", result)
    return result

def BuatLabel(srcfile):
    labelDict = dict()
    with open(srcfile) as f:
        for line in f:
            line = line.split(" ")
            line[1] = line[1].replace("\n", "")
            labelDict[line[1]] = line[0]
        f.close()
    return labelDict

def GetTotalInClass(labelDict):
    TotalSpam = 0
    TotalHam = 0
    for i in labelDict.keys():
        if labelDict[i] == '0':
            TotalSpam += 1
        elif labelDict[i] == '1':
            TotalHam += 1
    return (TotalSpam,TotalHam)

def Classification(filename, mailcontent, labelDict, TotalSpamHam, k):
    matrixConfussion = defaultdict(int)
    
    kamusKataSpam = defaultdict(int)
    kamusKataHam = defaultdict(int)

    kamusKata = list()

    #openfile
    with open(filename, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            key = row['word']
            kamusKata.append(key)
            if key not in kamusKataSpam:
                if(row['spam'] != '0'):
                    kamusKataSpam[key] = row['spam']
            if key not in kamusKataHam:
                if(row['ham'] != '0'):
                    kamusKataHam[key] = row['ham'] 

    totalSpam = TotalSpamHam[0]
    totalHam = TotalSpamHam[1] 
    
    probSpam = float(totalSpam + k)/(totalSpam+totalHam + len(totalSpamHam))
    probHam = float(totalHam + k)/(totalSpam+totalHam + len(totalSpamHam))

    tempprobSpam = copy.copy(probSpam)
    tempprobHam = copy.copy(probHam)


    kataDataUji = defaultdict(int)

    stopWords = set(stopwords.words('english'))
    d = enchant.Dict("en_US")
    lemma = nltk.wordnet.WordNetLemmatizer()

    listKata = mailcontent.split()
    for kata in listKata:
        kata = kata.lower()
        if kata not in stopWords:   # hilangin stopword
            kata = lemma.lemmatize(kata) # stemming
            if kata != '':
                if not d.check(kata):
                    suggest = d.suggest(kata)
                    if len(suggest) != 0:
                        kata = suggest[0]
                        kata = kata.lower()
                        kataDataUji[kata] += 1
                else:
                    kataDataUji[kata] += 1

    for key in kataDataUji.keys():
        tempprobSpam *= (kataDataUji[key]*((float(kamusKataSpam[key])+ k)/(len(kamusKataSpam)+len(kamusKata)))) 
        tempprobHam *= (kataDataUji[key]*((float(kamusKataHam[key]) + k)/(len(kamusKataHam)+len(kamusKata))))

    if tempprobSpam < tempprobHam:
        predictClass = 1
    elif tempprobSpam >= tempprobHam:
        predictClass = 0

    return predictClass

###################################################################
# main function start here

filelabel = 'E:/sem7/TKI/projek/spamfilter/spamfilter/data/label/SPAMTrain.label'
filename = "E:/sem7/TKI/projek/spamfilter/spamfilter/data/train.csv"

labelDict = BuatLabel(filelabel)

totalSpamHam = GetTotalInClass(labelDict)

mailcontent = str(sys.argv[1]) + " " + str(sys.argv[2])

hasil = Classification(filename, mailcontent, labelDict, totalSpamHam, 1) 

out = {}
out['hasil'] = hasil
out['content'] = mailcontent

print(json.dumps(out))
