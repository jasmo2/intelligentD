from sklearn import tree
from sklearn import cross_validation
from sklearn.metrics import confusion_matrix
import numpy as np
import pickle

# X: atributos, debe ser numpyarray
# y: target, debe ser numpyarray
class DataMinning:
    def analyse(self, X, y):
        clf = tree.DecisionTreeClassifier()

        #CROSS VALIDATION
        #Stratified sampling
        kfold = cross_validation.StratifiedKFold(y, n_folds=3, shuffle=False, random_state=None)
        cross = [clf.fit(X[train], y[train]).score(X[test], y[test]) \
        for train, test in kfold]

        results = {"crossvalidation": np.mean(cross), "modelo": pickle.dumps(clf)}
        return results


    def executeModel(self,model, X):
        clf2 = pickle.loads(model)
        return clf2.predict(X)

    def confusion_matrix(self,y_true,y_pred, myDic):

        # y_true = [2, 0, 2, 2, 0, 1]
        # y_pred = [0, 0, 2, 2, 0, 2]
        cm = confusion_matrix(y_true, y_pred)
        raise NotImplemented