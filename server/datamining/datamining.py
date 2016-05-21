from sklearn import tree
from sklearn import cross_validation
import numpy as np
import pickle

# X: atributos, debe ser numpyarray
# y: target, debe ser numpyarray
def analyse(X, y):
    clf = tree.DecisionTreeClassifier()

    #CROSS VALIDATION
    #Stratified sampling
    kfold = cross_validation.StratifiedKFold(y, n_folds=3, shuffle=False, random_state=None)
    cross = [clf.fit(X[train], y[train]).score(X[test], y[test])
    for train, test in kfold]

    results = {"cossvalidation": cross, "modelo": pickle.dumps(clf)}
    return results


def executeModel(model, X):
    clf2 = pickle.loads(model)
    return clf2.predict(X)
