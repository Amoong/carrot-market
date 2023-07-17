import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error: undefined | any;
}

type UseMutationResult<T> = [(data?: any) => void, UseMutationState<T>];

export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<undefined | any>(undefined);

  function enter(data: any) {
    setLoading(true);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) =>
        response.json().catch(() => {
          return;
        })
      )
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }

  return [enter, { loading, data, error }];
}
