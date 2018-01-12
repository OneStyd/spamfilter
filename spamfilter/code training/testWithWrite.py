#!/usr/bin/python
# FileName: Subsampling.py 
# Version 1.0 by Tao Ban, 2010.5.26
# This function extract all the contents, ie subject and first part from the .eml file 
# and store it in a new file with the same name in the dst dir. 

import email.parser 
import os, sys, stat
import shutil
import re
from collections import defaultdict
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize 
import nltk
import pprint
import enchant
import csv
import copy

def extract_body(payload):
    if isinstance(payload,str):
        return payload
    else:
        return '\n'.join([extract_body(part.get_payload()) for part in payload])

def ExtractSubPayload (filename):
    ''' Extract the subject and payload from the .eml file.
    
    '''
    if not os.path.exists(filename): # dest path doesnot exist
        print "ERROR: input file does not exist:", filename
        os.exit(1)
    fp = open(filename)
    msg = email.message_from_file(fp)
    payload = msg.get_payload()
    payload = extract_body(payload)
    # if type(payload) == type(list()) :
    #     payload = payload[0] # only use the first part of payload
    sub = msg.get('Subject')
    sub = str(sub)
    if payload is None:
        payload = ''
    if type(payload) != type('') :
        payload = str(payload)
    return sub + " " + payload

def ExtractBodyFromDir ( srcdir, dstdir ):
    '''Extract the body information from all .eml files in the srcdir and 
    
    save the file to the dstdir with the same name.'''
    if not os.path.exists(dstdir): # dest path doesnot exist
        os.makedirs(dstdir)  
    files = os.listdir(srcdir)
    for file in files:
        srcpath = os.path.join(srcdir, file)
        dstpath = os.path.join(dstdir, file)
        src_info = os.stat(srcpath)
        if stat.S_ISDIR(src_info.st_mode): # for subfolders, recurse
            ExtractBodyFromDir(srcpath, dstpath)
        else:  # copy the file
            body = ExtractSubPayload (srcpath)
            body = CleanData(body)
            dstfile = open(dstpath, 'w')
            dstfile.write(body)
            dstfile.close()


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

def BuatCorpus(srcdir, labelDict):
    kamusKata = list()
    kamusKataSpam = defaultdict(int)
    kamusKataHam = defaultdict(int)
    stopWords = set(stopwords.words('english'))
    d = enchant.Dict("en_US")
    lemma = nltk.wordnet.WordNetLemmatizer()
    files = os.listdir(srcdir)
    for file in files:
        fp = open(srcdir + file, 'r').read()
        listKata = fp.split(" ")
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
                            if kata not in kamusKata:
                                kamusKata.append(kata)
                            if labelDict[file] == '0' :
                                kamusKataSpam[kata] += 1
                            elif labelDict[file] == '1': 
                                kamusKataHam[kata] += 1
                    else:
                        if kata not in kamusKata:
                            kamusKata.append(kata)
                        if labelDict[file] == '0' :
                            kamusKataSpam[kata] += 1
                        elif labelDict[file] == '1': 
                            kamusKataHam[kata] += 1
    return (kamusKata,kamusKataSpam, kamusKataHam)

def writeCorpusToCSV(filename, corpus):
    kamusKata = corpus[0]
    kamusKataSpam = corpus[1]
    kamusKataHam = corpus[2]
    with open(filename, 'w') as csvfile:
        fieldnames = ['word', 'spam', 'ham']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for i in range(len(kamusKata)):
             writer.writerow({'word': kamusKata[i], 'spam': kamusKataSpam[kamusKata[i]], 'ham': kamusKataHam[kamusKata[i]]})


def Classification(filename, srcTest, labelDict, TotalSpamHam, k):
    matrixConfussion = defaultdict(int)
    predictClass = dict()
    
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

    files = os.listdir(srcTest)
    for file in files:
        fp = open(srcTest + file , 'r').read()
        listKata = fp.split(" ")
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
            predictClass[file] = '1'
        elif tempprobSpam >= tempprobHam:
            predictClass[file] = '0'

        tempprobSpam = copy.copy(probSpam)
        tempprobHam = copy.copy(probHam)

        kataDataUji.clear()

        if predictClass[file] == labelDict[file] and predictClass[file] == '0': 
            matrixConfussion['TP'] += 1
        elif predictClass[file] == '1' and labelDict[file] == '0':
            matrixConfussion['FN'] += 1
        elif predictClass[file] == '0' and labelDict[file] == '1':
            matrixConfussion['FP'] += 1
        elif predictClass[file] == labelDict[file] and predictClass[file] == '1':
            matrixConfussion['TN'] += 1

    return (predictClass, matrixConfussion)

def hitungAkurasi (matrixConfussion):
    akurasi = float(matrixConfussion['TP']+matrixConfussion['TN'])/(matrixConfussion['TP']+matrixConfussion['FP']+matrixConfussion['TN']+matrixConfussion['FN'])
    return akurasi

def hitungSensitifitas (matrixConfussion):
    sensitifitas = float(matrixConfussion['TP'])/(matrixConfussion['TP'] + matrixConfussion['FN'])
    return sensitifitas

def hitungSpesifisitas (matrixConfussion):
    spesifisitas = float(matrixConfussion['TP'])/(matrixConfussion['FP'] + matrixConfussion['TN'])
    return spesifisitas

###################################################################
# main function start here

srcTrain = 'E:/sem7/TKI/projek/spamfilter/spamfilter/data/belum praproses TRAINING'
# srcTest = 'E:/sem7/TKI/projek/CSDMC2010_SPAM/CSDMC2010_SPAM/TESTING'
dstTrain = 'E:/sem7/TKI/projek/spamfilter/spamfilter/data/training/'
dstTest = 'E:/sem7/TKI/projek/spamfilter/spamfilter/data/testing/'
filelabel = 'E:/sem7/TKI/projek/spamfilter/spamfilter/data/label/SPAMTrain.label'
# coba = 'E:/sem7/TKI/projek/spamfilter/coba/'
# dst = 'E:/sem7/TKI/projek/spamfilter/extract/'

###################################################################

# ExtractBodyFromDir ( srcTrain, dstTrain ) 
# ExtractBodyFromDir(srcTest, dstTest)
# ExtractBodyFromDir(coba,dst)

labelDict = BuatLabel(filelabel)

totalSpamHam = GetTotalInClass(labelDict)

# corpus = BuatCorpus(coba,labelDict)

filename = "E:/sem7/TKI/projek/spamfilter/spamfilter/data/train.csv"


# #catatan untuk WriteCorpus Jalanin Sekali, setelah udah bikin file csvnya ga perlu dijalanin lagi ketika klasifikasi

# writeCorpusToCSV(filename, corpus) # membuat corpus dengan file csv

hasil = Classification(filename, dst, labelDict, totalSpamHam, 1) 



akurasi = hitungAkurasi(hasil[1])
sensitifitas = hitungSensitifitas(hasil[1])
spesifisitas = hitungSpesifisitas(hasil[1])

pprint.pprint(hasil[0])
pprint.pprint(hasil[1])
pprint.pprint("akurasi: " + str(akurasi))
pprint.pprint("sensitifitas: " + str(sensitifitas))
pprint.pprint("spesifisitas: " + str(spesifisitas))