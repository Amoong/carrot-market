import { useState } from "react";

interface UseMutationState {
  loading: boolean;
  data: undefined | any;
  error: undefined | any;
}

export default function useMutation(
  url: string
): [(data?: any) => void, UseMutationState] {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);

  function enter(data: any) {
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
