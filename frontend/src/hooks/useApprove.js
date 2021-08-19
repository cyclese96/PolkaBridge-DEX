import { useCallback, useEffect, useState } from "react";

const useApprove = (token) => {
  const [isApproved, setApproved] = useState(false);
  const [checkingAllowance, setChecking] = useState(true);

  const handleApprove = useCallback(
    (_token) => {
      // call confrim allowance
    },
    [isApproved]
  );

  useEffect(() => {
    // check allowance here
  }, []);

  return { approveTokens: handleApprove, isApproved };
};

export default useApprove;
