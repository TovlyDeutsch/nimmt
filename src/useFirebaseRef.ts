import { useEffect, useState } from "react";

import firebase from "./firebaseInitialize";

function useFirebaseRef(path: string): [any, (arg0: any) => void, boolean] {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const dataRef = firebase.database().ref(path);
    const update = (snapshot: firebase.database.DataSnapshot) => {
      setValue(snapshot.val());
      setLoading(false);
    };
    dataRef.on("value", update);
    return () => {
      dataRef.off("value", update);
    };
  }, [path]);

  const updateValue = (newValue: any) => {
    const dataRef = firebase.database().ref(path);
    // TODO handle set failures or timeouts (set returns a promise)
    dataRef.set(newValue);
  };

  return [value, updateValue, loading];
}

export default useFirebaseRef;
