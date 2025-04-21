import { MutationTracker } from "mutation-tracker";
import { useRef } from "react";
import { FormVaidationConfig } from "../types/FormVaidationConfig";


export function useStateTrackers<T extends { [field: string]: any } | {}>(dataObject: T, config?: FormVaidationConfig) {

  const touchedStateTracker = useRef(MutationTracker(dataObject, {
    defaultValue: false,
    initialMutation: {
      mutatedAttributes: config?.initiallyTouched,
      mutatedValue: true
    }
  }));

  const dirtyStateTracker = useRef(MutationTracker(dataObject, {
    defaultValue: false,
    initialMutation: {
      mutatedAttributes: config?.initiallyDirty,
      mutatedValue: true
    }
  }));

  const errorStateTracker = useRef(MutationTracker(dataObject, {
    defaultValue: [] as string[]
  }));

  return {
    errorStateTracker: errorStateTracker.current,
    touchedStateTracker: touchedStateTracker.current,
    dirtyStateTracker: dirtyStateTracker.current,
  }

}