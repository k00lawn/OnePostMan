from textblob import TextBlob
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer as wnl
import pandas as pd
import re
from sklearn.feature_extraction.text import CountVectorizer as cvec
import nltk
import string

def language(text):

    if len(text) > 3:
        blob = TextBlob(text)
        text_lang = blob.detect_language()
        langs = {}
        langs['en'] = 'english'
        langs['es'] = 'spanish'
        langs['fr'] = 'french'

        if text_lang in langs.keys():
            return langs[text_lang]
        else:
            return 'english'

def clean(comment, dtm = None):

    lang = language(comment)
    no_http = re.sub(r'''https?://[\w/._-]+''', '', comment)
    no_at = re.sub(r'@\w+', '', no_http)
    no_punc = re.sub(f'[{string.punctuation}]','',no_at)
    no_nums = re.sub(r'[0-9]+','',no_punc)
    tokenized = nltk.word_tokenize(no_nums)
    stop_words = set(stopwords.words(lang))
    tokenized = [i for i in tokenized if i not in stop_words and len(i) > 1 ]

    lemma = wnl()
    cleaned = [lemma.lemmatize(i) for i in tokenized]

    if dtm is not None:
        cv = cvec()
        cv_df = cv.fit_transform(cleaned)
        cleaned = pd.DataFrame(cv_df.toarray(),columns = cv.get_feature_names())

    return cleaned