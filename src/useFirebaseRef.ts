import { useEffect, useState } from "react";
import firebase from "./firebaseInitialize";

/**
 * Takes in existing databaseState and returns new databaseState.
 * Returns `undefined` if no update should be performed
 */
export type FirebaseDbUpdater<T> = (databaseState: T) => T | undefined;

export type StringifiedFirebaseDbUpdater = (
  databaseStateString: string
) => string | undefined;

export function useFirebaseRef<T>(
  path: string
): [T | null, (valueUpdater: FirebaseDbUpdater<T>) => void, boolean] {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const dataRef = firebase.database().ref(path);
    const update = (snapshot: firebase.database.DataSnapshot) => {
      const retrievedValue = snapshot.val();
      // // console.log(retrievedValue);
      setValue(retrievedValue === null ? null : JSON.parse(retrievedValue));
      setLoading(false);
    };
    dataRef.on("value", update);
    return () => {
      dataRef.off("value", update);
    };
  }, [path]);

  const updateValueWithFunction = (valueUpdater: FirebaseDbUpdater<T>) => {
    const dataRef = firebase.database().ref(path);
    const stringifiedWrappedValueUpdater: StringifiedFirebaseDbUpdater = (
      databaseStateString: string
    ) => {
      const newValue = valueUpdater(JSON.parse(databaseStateString));
      return newValue === undefined ? undefined : JSON.stringify(newValue);
    };
    // TODO handle set failures or timeouts (transaction returns a promise)
    dataRef.transaction(stringifiedWrappedValueUpdater, undefined, false);
  };

  return [value, updateValueWithFunction, loading];
}
